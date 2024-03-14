<template>
  <div class="home">
    <Todo />
  </div>
</template>

<script>
// @ is an alias to /src
import Todo from "@/components/Todo.js";

export default {
  name: "HomeView",
  components: {
    Todo,
  },
};
</script>
