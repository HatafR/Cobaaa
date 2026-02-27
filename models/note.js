let notes = [
  { 
    id: 1, 
    title: 'first note', 
    content: 'My first note is here.'
  }
];

let nextId = 2;

// GET ALL
export function list() {
  return notes.map(({ id, title, author }) => ({ id, title, author }));
}

// GET BY ID
export function getById(id) {
  return notes.find(note => note.id === id);
}

// CREATE
export function create({ title, content, author }) {
  const newNote = {
    id: nextId++,
    title,
    content,
    author
  };
  notes.push(newNote);
  return newNote;
}

// UPDATE
export function update(id, { title, content, author }) {
  const note = notes.find(n => n.id === id);
  if (!note) return null;

  note.title = title ?? note.title;
  note.content = content ?? note.content;
  note.author = author ?? note.author;

  return note;
}

// DELETE
export function remove(id) {
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) return false;

  notes.splice(index, 1);
  return true;
}