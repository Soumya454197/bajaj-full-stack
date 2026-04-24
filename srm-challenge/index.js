const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/bfhl', (req, res) => {
  const data = req.body.data || [];

  // --- Step 1: Validate entries ---
  const validEdges = [];
  const invalidEntries = [];
  const duplicateEdges = [];
  const seenEdges = new Set();

  for (let raw of data) {
    const entry = raw.trim();
    const match = entry.match(/^([A-Z])->([A-Z])$/);

    if (!match) {
      invalidEntries.push(raw);
      continue;
    }

    const [_, parent, child] = match;

    if (parent === child) {
      invalidEntries.push(raw);
      continue;
    }

    const edgeKey = `${parent}->${child}`;

    if (seenEdges.has(edgeKey)) {
      if (!duplicateEdges.includes(edgeKey)) {
        duplicateEdges.push(edgeKey);
      }
      continue;
    }

    seenEdges.add(edgeKey);
    validEdges.push([parent, child]);
  }

  // --- Step 2: Build adjacency & track parents ---
  const children = {};
  const parentCount = {};

  for (const [p, c] of validEdges) {
    if (!children[p]) children[p] = [];
    if (parentCount[c] === undefined) parentCount[c] = 0;
    if (parentCount[p] === undefined) parentCount[p] = 0;

    // Diamond case: only first parent wins
    if (parentCount[c] > 0) continue;

    children[p].push(c);
    parentCount[c] = (parentCount[c] || 0) + 1;
  }

  // --- Step 3: Find all nodes ---
  const allNodes = new Set();
  for (const [p, c] of validEdges) {
    allNodes.add(p);
    allNodes.add(c);
  }

  // --- Step 4: Find roots (nodes with no parent) ---
  const roots = [...allNodes].filter(n => !parentCount[n]).sort();

  // --- Step 5: Group nodes & detect cycles ---
  const visited = new Set();
  const hierarchies = [];

  function buildTree(node) {
    const kids = children[node] || [];
    const result = {};
    for (const kid of kids) {
      result[kid] = buildTree(kid);
    }
    return result;
  }

  function getDepth(node) {
    const kids = children[node] || [];
    if (kids.length === 0) return 1;
    return 1 + Math.max(...kids.map(getDepth));
  }

  function getGroupNodes(start) {
    const group = new Set();
    const queue = [start];
    while (queue.length) {
      const n = queue.shift();
      if (group.has(n)) continue;
      group.add(n);
      for (const c of (children[n] || [])) queue.push(c);
    }
    return group;
  }

  function hasCycle(node, visiting = new Set(), done = new Set()) {
    if (visiting.has(node)) return true;
    if (done.has(node)) return false;
    visiting.add(node);
    for (const c of (children[node] || [])) {
      if (hasCycle(c, visiting, done)) return true;
    }
    visiting.delete(node);
    done.add(node);
    return false;
  }

  for (const root of roots) {
    if (visited.has(root)) continue;
    const group = getGroupNodes(root);
    group.forEach(n => visited.add(n));

    const cycleFound = hasCycle(root);

    if (cycleFound) {
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const tree = { [root]: buildTree(root) };
      const depth = getDepth(root);
      hierarchies.push({ root, tree, depth });
    }
  }

  // Handle pure cycles (no root found)
  for (const node of allNodes) {
    if (!visited.has(node)) {
      const group = getGroupNodes(node);
      group.forEach(n => visited.add(n));
      const root = [...group].sort()[0];
      hierarchies.push({ root, tree: {}, has_cycle: true });
    }
  }

  // --- Step 6: Summary ---
  const nonCyclic = hierarchies.filter(h => !h.has_cycle);
  const totalCycles = hierarchies.filter(h => h.has_cycle).length;

  let largestRoot = '';
  let maxDepth = -1;
  for (const h of nonCyclic) {
    if (h.depth > maxDepth || (h.depth === maxDepth && h.root < largestRoot)) {
      maxDepth = h.depth;
      largestRoot = h.root;
    }
  }

  res.json({
    user_id: "soumyagupta_21082005",       // ← change this
    email_id: "sg0959@srmist.edu.in",         // ← change this
    college_roll_number: "RA2311047010187",     // ← change this
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: nonCyclic.length,
      total_cycles: totalCycles,
      largest_tree_root: largestRoot
    }
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));