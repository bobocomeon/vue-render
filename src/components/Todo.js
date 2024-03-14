import ToDoList from "./ToDoList";

export default {
  data() {
    return {
      newTodoText: "",
      todos: [],
      nextTodoId: 0,
      filter: "all",
    };
  },
  computed: {
    filteredTodos() {
      switch (this.filter) {
        case "active":
          return this.todos.filter((todo) => !todo.completed);
        case "completed":
          return this.todos.filter((todo) => todo.completed);
        default:
          return this.todos;
      }
    },
  },
  methods: {
    addNewTodo() {
      if (this.newTodoText.trim().length === 0) {
        return;
      }
      this.todos.push({
        id: this.nextTodoId++,
        text: this.newTodoText,
        completed: false,
      });
      this.newTodoText = "";
    },
    removeTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    },
    editTodo(id, text) {
      const index = this.todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        this.todos[index].text = text;
      }
    },
    toggleTodoComplete(id) {
      const index = this.todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        this.todos[index].completed = !this.todos[index].completed;
      }
    },
  },
  render(h) {
    return h("div", [
      h(
        "form",
        {
          on: {
            submit: (event) => {
              event.preventDefault();
              this.addNewTodo();
            },
          },
        },
        [
          h("input", {
            domProps: { value: this.newTodoText },
            on: {
              input: (event) => (this.newTodoText = event.target.value),
            },
          }),
          h(
            "button",
            {
              attrs: { type: "submit" },
            },
            "Add Todo"
          ),
        ]
      ),
      h("div", [
        "Show: ",
        h(
          "button",
          {
            on: { click: () => (this.filter = "all") },
            attrs: { disabled: this.filter === "all" },
          },
          "All"
        ),
        h(
          "button",
          {
            on: { click: () => (this.filter = "active") },
            attrs: { disabled: this.filter === "active" },
          },
          "Active"
        ),
        h(
          "button",
          {
            on: { click: () => (this.filter = "completed") },
            attrs: { disabled: this.filter === "completed" },
          },
          "Completed"
        ),
      ]),
      h(ToDoList, {
        props: {
          todos: this.filteredTodos,
        },
        on: {
          remove: this.removeTodo,
          edit: this.editTodo,
          toggleComplete: this.toggleTodoComplete,
        },
      }),
    ]);
  },
};
