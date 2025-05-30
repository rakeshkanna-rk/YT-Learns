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

async function getVideoInfo(url) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        url
      )}&format=json`
    );
    const data = await res.json();
    return {
      title: data.title,
      thumbnail: data.thumbnail_url,
      author: data.author_name,
      authorUrl: data.author_url,
    };
  } catch (err) {
    console.warn("oEmbed failed for:", url);
    return {
      title: "Unknown Title",
      thumbnail:
        "https://rakeshkanna-rk.github.io/database/img/img_placeholder.png",
      author: "anonymous",
      authorUrl: "#",
    };
  }
}

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
    const rawItems = results.flat();

    // Enrich each video item with title/thumbnail via oEmbed
    const enriched = await Promise.all(
      rawItems.map(async (item) => {
        const info = await getVideoInfo(item.link);
        return {
          ...item,
          title: forceTwoLineText(info.title, "h1"),
          description: forceTwoLineText(item.description || "", "p"),
          thumbnail: info.thumbnail,
          author: info.author,
          authorUrl: info.authorUrl,
        };
      })
    );

    allData.value = enriched;

    // Unique tags
    const tags = new Set();
    enriched.forEach((item) => item.tags?.forEach((tag) => tags.add(tag)));
    allTags.value = [...tags].sort();
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

function forceTwoLineText(text, type) {
  // Adjust based on average character width; here we assume < 50 chars = short
  if (text.length < 25 && !text.includes("\n") && type=="h1") {
    console.info(text, "->", text + "\n added line break");
    return text + "<br>"; // force line break
  }
  if (text.length < 30 && !text.includes("\n") && type=="p") {
    console.info(text, "->", text + "\n added line break");
    return text + "<br>"; // force line break
  }
  return text;
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

const filtered = computed(() => {
  return allData.value.filter((item) => {
    const q = query.value;
    const matchesQuery =
      !q ||
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
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
  <SectionHeader
    title="Tutorials"
    subtitle="Find the perfect YouTube video for your learning needs"
  />

  <div class="p-4 max-w-5xl mx-auto mt-[50px]">
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
        :class="[activeTag === tag ? 'tag-active' : 'tag']"
        class="tag"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Results -->
    <div v-if="filtered.length" class="card-list">
      <div v-for="item in filtered" :key="item.link" class="card">
        <div class="card-wrapper">
          <!-- YouTube Thumbnail -->
          <img :src="item.thumbnail" alt="Video thumbnail" />
          <!-- Card Content -->
          <div class="card-content">
            <h2 class="text-xl font-semibold">{{ item.title }}</h2>
            <p class="text-sm text-gray-600">{{ item.description }}</p>

            <p v-if="item.author" class="text-sm mt-2 text-gray-500 author-p">
              Author:
              <a
                :href="item.authorUrl"
                target="_blank"
                class="text-blue-500 underline author"
              >
                {{ item.author }}
              </a>
            </p>

            <div v-if="item.documents?.length" class="mt-2">
              <p class="text-sm font-medium ">Docs:</p>
              <a
                v-for="doc in item.documents"
                :key="doc.url"
                :href="doc.url"
                target="_blank"
                class="doc-link"
              >
                {{ doc.title }}
              </a>
            </div>

            <div class="btn-wrapper">
              <a :href="item.link" target="_blank" class="watch-btn"
                >Watch Video</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="mt-6 text-gray-500">Unable to find any results</p>
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
  color: var(--c-wh ite);
}

.search-btn:hover {
  cursor: pointer;
}

/* ---------------- */

.card-content {
  padding: 10px;
}

.card-content p {
  margin-top: 10px;
  margin-bottom: 10px;
  opacity: 0.8;
  font-size: 0.9rem;
  color: var(--c-white);
}

.card-content h2,
.card-content p {
  white-space: pre-line; /* Enables line breaks from \n */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
}

.btn-wrapper {
  display: inline-flex;
  align-items: center;
  background: var(--blue-r-grad);
  padding: 2px;
  border-radius: 10px;
  margin-top: 10px;
  bottom: 0px;
}

.watch-btn {
  padding: 10px 20px;
  color: var(--c-white);
  font-size: var(--p);
  font-weight: 600;
  text-decoration: none;
  background: var(--bg-color);
  border-radius: 8px;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: start;
  background: var(--blue-r-grad);
  padding: 2px;
  border-radius: 15px;
  transition: all 0.2s ease-in-out;
  color: var(--c-white);
}

.card-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: start;
  background: var(--bg-color);
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  color: var(--c-white);
}

.tag {
  padding: 5px 10px;
  border: 1px solid var(--c-grey);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: var(--c-grey);
}

.tag-active {
  background: var(--c-blue);
  border: none;
  color: var(--c-white);
}

.doc-link{
  color: var(--c-blue);
  padding: 5px 10px;
  text-decoration: none;
  border: 1px solid var(--c-blue);
  margin-right: 5px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  opacity: 0.8;
}

.doc-link:hover{
  opacity: 1;
}

.author-p {
  opacity: 0.8;
  font-size: var(--p);
  color: var(--c-white);
}

.author {
  display: -webkit-box;
  -webkit-line-clamp: 1; 
  -webkit-box-orient: vertical;
}
</style>
