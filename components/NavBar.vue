<template>
  <div class="lighting">
    <nav>
      <img src="@/assets/logo.svg" alt="Logo" @click="$router.push('/')"/>

      <div class="wrapper desktop">
        <div class="navlink" v-for="(link, index) in links" :key="index">
          <NuxtLink
            :to="link.path"
            :class="{ 'menu-item-active': route.path === link.path }"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
        <GradBtn link="/upload">Upload</GradBtn>

        <form @submit.prevent="handleGlobalSearch" class="desktop">
          <input
            v-model="globalSearchText"
            type="text"
            placeholder="Search tutorials..."
            class="search-input"
          />
          <button type="submit" class="search-btn">
            <img src="@/assets/icons/search.svg" alt="search icon" />
          </button>
        </form>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="menu-wrapper" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <img
          :src="
            isMobileMenuOpen
              ? '/icons/x.svg'
              : '/icons/menu.svg'
          "
          :alt="isMobileMenuOpen ? 'close menu' : 'open menu'"
          class="menu"
        />
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <div class="mobile-links">
        <NuxtLink
          v-for="(link, index) in mobileLinks"
          :key="index"
          :to="link.path"
          @click="isMobileMenuOpen = false"
          :class="{ 'menu-item-active': route.path === link.path }"
        >
          {{ link.name }}
        </NuxtLink>
      </div>

      <!-- Mobile Search -->
      <form @submit.prevent="handleGlobalSearch" class="desktop">
        <input
          v-model="globalSearchText"
          type="text"
          placeholder="Search tutorials..."
          class="search-input addonWrapper"
        />
        <button type="submit" class="search-btn">
          <img src="@/assets/icons/search.svg" alt="search icon" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const links = [
  { name: "Home", path: "/" },
  { name: "Tutorials", path: "/tutorials" },
];

// Mobile Menu
const isMobileMenuOpen = ref(false);
const mobileLinks = [
  { name: "Home", path: "/" },
  { name: "Tutorials", path: "/tutorials" },
  { name: "Upload", path: "/upload" },
];

// Sync input
const globalSearchText = ref("");

function handleGlobalSearch() {
  const trimmed = globalSearchText.value.trim();
  if (trimmed) {
    router.push({ path: "/tutorials", query: { q: trimmed } });
  }
}
</script>

<style scoped>
img {
  height: 45px;
}

.wrapper {
  display: flex;
  gap: 10px;
}

.lighting {
  padding-bottom: 2px;
  background: linear-gradient(90deg, #010101 0%, #2563ff 50%, #010101 100%);
}

nav {
  display: flex;
  justify-content: space-between;
  padding: var(--side-pad);
  align-items: center;
  background: var(--bg-color);
}

.navlink {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  color: var(--c-grey);
  font-size: 1.2rem;
}

.menu-item-active {
  color: var(--c-white);
}

/* FORM */

form {
  display: flex;
  flex-wrap: wrap;
  background: var(--blue-r-grad);
  border-radius: 10px;
  padding: 2px;
  transition: background 0.3s ease;
}

form:focus-within {
  background: var(--green-r-grad);
}

form img {
  height: 25px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

form img:hover {
  opacity: 1;
}

.search-input {
  padding: 10px;
  background: var(--bg-color);
  border: none;
  color: var(--c-white);
  border-radius: 8px 0 0 8px;
}

.search-input::placeholder {
  color: var(--c-grey);
}

.search-input:focus {
  outline: none;
}

.search-btn {
  padding: 10px 20px;
  background: var(--bg-color);
  border: none;
  border-radius: 0 8px 8px 0;
  color: var(--c-white);
}

.menu {
  display: none;
  height: 45px;
  background: var(--bg-color);
  padding: 5px;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.menu-wrapper:active .menu {
  transform: rotate(90deg);
}


.menu-wrapper {
  display: none;
  padding: 1px;
  background: var(--blue-r-grad);
  border-radius: 8px;
  cursor: pointer;
}

@media screen and (max-width: 960px) {
  .desktop {
    display: none;
  }

  .menu,
  .menu-wrapper {
    display: block;
  }
}

/* MOBILE MENU */
.mobile-menu {
  background-color: var(--bg-color);
  padding: 20px;
  border-top: 1px solid #2a2a2a;
  animation: slideDown 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mobile-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 16px;
  color: var(--c-grey);
}

.mobile-links a {
  font-size: 1.5rem;
  text-decoration: none;
}

.mobile-menu form {
  display: flex;
  gap: 0;
  background: var(--blue-r-grad);
  border-radius: 10px;
  padding: 2px;
}

@keyframes slideDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.addonWrapper{
  flex-grow: 1;
}
</style>
