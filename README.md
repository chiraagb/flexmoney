# Frontend 
used react with vite and tailwind css for styling 

# Backend 
used nodejs and mongodb as a database 

# ER diagram
there is only one user model with the following schema, making sure that person with same name cannot enter in two batches simultaneously
```
user.model.js
  name: { type: String, unique: true }, 
  age: Number,
  selectedBatch: String,
```


