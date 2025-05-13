<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const query = ref(route.query.q?.toLowerCase() || "");
const activeTag = ref(route.query.tag || "");
const searchText = ref(route.query.q || "");

const allData = ref([]);
const allTags = ref([]);

// 1. Fetch and Combine JSON from all links
async function fetchTutorials() {
  const topicListUrl =
    "https://rakeshkanna-rk.github.io/database/YT-Learns/topics.json";
  try {
    const topicRes = await fetch(topicListUrl);
    const topicUrls = await topicRes.json();

    const dataPromises = topicUrls.map((url) =>
      fetch(url).then((r) => r.json())
    );
    const results = await Promise.all(dataPromises);

    // Flatten combined results
    allData.value = results.flat();

    // Extract unique tags
    const tags = new Set();
    allData.value.forEach((item) => item.tags?.forEach((tag) => tags.add(tag)));
    allTags.value = [...tags];
  } catch (err) {
    console.error("Failed to fetch tutorial data:", err);
  }
}

onMounted(fetchTutorials);

function setTag(tag) {
  const isSameTag = activeTag.value === tag;
  const newQuery = { ...route.query };

  if (isSameTag) {
    delete newQuery.tag;
    activeTag.value = "";
  } else {
    newQuery.tag = tag;
    activeTag.value = tag;
  }

  router.push({ path: "/tutorials", query: newQuery });
}

function handleLocalSearch() {
  const trimmed = searchText.value.trim();
  const currentQuery = route.query.q || "";
  if (trimmed !== currentQuery) {
    router.push({ path: "/tutorials", query: { ...route.query, q: trimmed } });
  } else {
    router.replace({
      path: "/tutorials",
      query: { ...route.query, q: trimmed, _t: Date.now() },
    });
    query.value = trimmed.toLowerCase();
  }
}

function getYouTubeThumbnail(url) {
  const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regExp);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}


const filtered = computed(() => {
  return allData.value.filter((item) => {
    const q = query.value;
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
      item.documents?.some((doc) => doc.title.toLowerCase().includes(q));

    const matchesTag = !activeTag.value || item.tags?.includes(activeTag.value);

    return matchesQuery && matchesTag;
  });
});

watch(
  () => route.query.q,
  (newQ) => {
    query.value = newQ?.toLowerCase() || "";
    searchText.value = newQ || "";
  }
);

watch(
  () => route.query.tag,
  (newTag) => {
    activeTag.value = newTag || "";
  }
);
</script>

<template>
  <div class="p-4 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Tutorials</h1>

    <!-- Search Input -->
    <form @submit.prevent="handleLocalSearch">
      <input
        v-model="searchText"
        placeholder="Search tutorials..."
        class="search-input"
      />
      <button type="submit" class="search-btn">
        <img src="@/assets/icons/search.svg" alt="search icon" />
      </button>
    </form>

    <!-- Tag Filter -->
    <div class="flex flex-wrap gap-2 mt-4">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="setTag(tag)"
        :class="[
          activeTag === tag
            ? 'bg-[#2563FF] text-white'
            : 'border-gray-300 text-gray-600',
        ]"
        class="px-3 py-1 rounded border text-sm"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Results -->
    <div v-if="filtered.length" class="mt-6 space-y-4">
      <div
        v-for="item in filtered"
        :key="item.link"
        class="p-4 bg-white rounded shadow"
      >
        <!-- YouTube Thumbnail -->
        <img
          :src="getYouTubeThumbnail(item.link)"
          alt="Video thumbnail"
          class="w-40 h-auto rounded"
        />
        <h2 class="text-xl font-semibold">{{ item.title }}</h2>
        <p class="text-sm text-gray-600">{{ item.description }}</p>
        <a :href="item.link" target="_blank" class="text-blue-600 underline"
          >Watch Video</a
        >
        <div v-if="item.documents?.length" class="mt-2">
          <p class="text-sm font-medium">Docs:</p>
          <ul class="list-disc list-inside text-sm">
            <li v-for="doc in item.documents" :key="doc.url">
              <a
                :href="doc.url"
                target="_blank"
                class="text-blue-500 underline"
              >
                {{ doc.title }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <p v-else class="mt-6 text-gray-500">No tutorials found.</p>
  </div>
</template>

<style scoped>
/* FORM */

form {
  display: flex;
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
}

.search-input {
  padding: 10px;
  background: var(--bg-color);
  border: none;
  color: var(--c-white);
  border-radius: 8px 0 0 8px;
  width: 100%;
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

.search-btn:hover {
  cursor: pointer;
}
</style>
