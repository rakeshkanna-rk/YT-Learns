<template>
  <div class="howto-section">
    <div class="card-wrapper" v-for="(item, index) in sectionPlace" :key="index">
      <div class="card">
        <div class="icon">
          {{ item.icon }}
        </div>
        <div class="title">
          {{ item.title }}
        </div>
        <div class="text">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const sectionPlace = [
  {
    icon: "🔍",
    title: "Search Topics",
    text: "Find curated YouTube tutorials by keyword or tags.",
  },
  {
    icon: "🎯",
    title: "Filter & Explore",
    text: "Browse by category, tags, or skills you want to learn.",
  },
  {
    icon: "📄",
    title: "Use Docs",
    text: "Access helpful learning materials along with videos.",
  },
  {
    icon: "🚀",
    title: "Learn & Share",
    text: "Watch, learn, and contribute your favorite resources.",
  },
];
</script>

<style scoped>
.howto-section {
  color: var(--c-white);
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  overflow: hidden;
  padding: 50px 0;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  text-align: center;
  max-width: 350px;
  width: 100%;
  padding: 40px 30px;
  background: var(--bg-color);
  border-radius: 20px;
}

.card-wrapper{
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  background: var(--blue-r-grad);
  padding: 2px;
  border-radius: 22px;
  transition: all 0.2s ease-in-out;
}

.card-wrapper:hover{
  scale: 1.02;
  filter: drop-shadow(0px 0px 5px #467aff);
}

.icon {
  font-size: 2.5rem;
}
.title {
  font-size: 1.2rem;
  font-weight: 600;
}
.text {
  font-size: 0.95rem;
  opacity: 0.8;
}
</style>
