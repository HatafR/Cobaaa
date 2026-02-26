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
  return notes.map(({ id, title }) => ({ id, title }));
}

// GET BY ID
export function getById(id) {
  return notes.find(note => note.id === id);
}

// CREATE
export function create({ title, content }) {
  const newNote = {
    id: nextId++,
    title,
    content
  };
  notes.push(newNote);
  return newNote;
}

// UPDATE
export function update(id, { title, content }) {
  const note = notes.find(n => n.id === id);
  if (!note) return null;

  note.title = title ?? note.title;
  note.content = content ?? note.content;

  return note;
}

// DELETE
export function remove(id) {
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) return false;

  notes.splice(index, 1);
  return true;
}