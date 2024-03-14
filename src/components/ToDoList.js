import ToDoItem from "./ToDoItem";

export default {
  name: "ToDoList",
  props: ["todos"],
  render(h) {
    return h(
      "ul",
      this.todos.map((todo) =>
        h(ToDoItem, {
          props: {
            todo: todo,
            onRemove: (id) => this.$emit("remove", id),
            onEdit: (id, text) => this.$emit("edit", id, text),
            onToggleComplete: (id) => this.$emit("toggleComplete", id),
          },
          key: todo.id,
        })
      )
    );
  },
};
