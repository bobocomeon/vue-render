export default {
  name: "ToDoItem",
  props: ["todo", "onRemove", "onEdit", "onToggleComplete"],
  data() {
    return {
      isEditing: false,
      editText: this.todo.text,
    };
  },
  methods: {
    saveEdit() {
      this.onEdit(this.todo.id, this.editText);
      this.isEditing = false;
    },
    cancelEdit() {
      this.editText = this.todo.text;
      this.isEditing = false;
    },
  },
  render(h) {
    const viewMode = h("div", [
      h("input", {
        attrs: { type: "checkbox", checked: this.todo.completed },
        on: {
          change: () => this.onToggleComplete(this.todo.id),
        },
      }),
      h(
        "span",
        {
          style: {
            textDecoration: this.todo.completed ? "line-through" : "none",
          },
        },
        this.todo.text
      ),
      h(
        "button",
        {
          on: {
            click: () => (this.isEditing = true),
          },
        },
        "Edit"
      ),
      h(
        "button",
        {
          on: {
            click: () => this.onRemove(this.todo.id),
          },
        },
        "Remove"
      ),
    ]);

    const editMode = [
      h("div", [
        h("input", {
          domProps: { value: this.editText },
          on: {
            input: (event) => (this.editText = event.target.value),
          },
        }),
        h(
          "button",
          {
            on: {
              click: this.saveEdit,
            },
          },
          "Save"
        ),
        h(
          "button",
          {
            on: {
              click: this.cancelEdit,
            },
          },
          "Cancel"
        ),
      ]),
    ];

    return h(
      "li",
      {
        attrs: {
          class: "item-name",
        },
      },
      [this.isEditing ? editMode : viewMode]
    );
  },
};
