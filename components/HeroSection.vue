<template>
  <div class="hero">
    <div class="head-text">
      <h1>Learn Smarter with Curated <span> YouTube Courses</span></h1>
      <p>
        Discover top-quality YouTube tutorials, handpicked to boost your skills
        in development, design, and more
      </p>
    </div>
    <div class="hero-btn">
      <GradBtn link="/tutorials">View Courses</GradBtn>
      <BtnSec link="/"
        >How to Learn <img src="@/assets/icons/arrow.svg" alt="arrow-right"
      /></BtnSec>
    </div>
  </div>
</template>

<script setup>
// Props, refs, and logic go here
</script>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  color: var(--c-white);
  padding: 30px 0;
  gap: 50px;
}

.head-text {
  text-align: center;
  align-items: center;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
}

h1 {
  font-size: var(--hero-h1);
  font-weight: 700;
}

h1 span {
  background: linear-gradient(45deg, #2563ff, #0ea5e9);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: var(--p);
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.hero-btn {
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 40px;
}
</style>
