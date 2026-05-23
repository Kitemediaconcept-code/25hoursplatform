/**
 * 25 Hours Platform — Public Course Loader
 * Database: Supabase (migrated from Firebase Firestore)
 */

import { supabase } from "./supabase-config.js";

// ─── Category colour map ───────────────────────────────────────────────────
const categoryColors = {
  "Business":      ["var(--accent-purple-light)", "var(--accent-purple)"],
  "Marketing":     ["var(--accent-teal-light)",   "var(--accent-teal)"],
  "Communication": ["var(--accent-amber-light)",  "var(--accent-amber)"],
  "Technology":    ["var(--accent-blue-light)",   "var(--accent-blue)"],
  "Finance":       ["var(--accent-purple-light)", "var(--accent-purple)"],
  "Design":        ["var(--accent-teal-light)",   "var(--accent-teal)"],
  "Development":   ["var(--accent-blue-light)",   "var(--accent-blue)"],
};

// ─── Build HTML for a single course card ──────────────────────────────────
function createCourseCardHTML(course) {
  const priceDisplay = course.price === 0 ? "Free" : `₹${course.price}`;
  const pillClass    = course.price === 0 ? "pill-amber" : "pill-teal";
  const pillText     = course.price === 0 ? "Workshop"   : "Certificate";

  const colors = categoryColors[course.category] || ["var(--bg-surface)", "var(--text-main)"];

  let visualContent = "";
  if (course.image && course.image.startsWith("http")) {
    visualContent = `<img src="${course.image}" alt="${course.title}" style="width: 100%; height: 100%; object-fit: cover;">`;
  } else {
    visualContent = `
      <svg viewBox="0 0 24 24" fill="none" stroke="${colors[1]}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    `;
  }

  return `
    <a class="c-card" data-cat="${course.category.toLowerCase()}" href="course-details.html?id=${course.id}">
      <div class="c-thumb" style="background:${colors[0]}; overflow: hidden;">
        ${visualContent}
      </div>
      <div class="c-body">
        <p class="c-tag">${course.category}</p>
        <h3 class="c-name">${course.title}</h3>
        <p class="c-by">${course.instructor} · ${course.duration}</p>
        <div class="c-foot">
          <span class="c-price">${priceDisplay}</span>
          <span class="pill ${pillClass}">${pillText}</span>
        </div>
      </div>
    </a>
  `;
}

// ─── Fetch and render courses ──────────────────────────────────────────────
async function loadPublicCourses() {
  const container      = document.getElementById("coursesContainer");
  const indexContainer = document.getElementById("featuredCoursesContainer");
  const targetContainer = container || indexContainer;

  if (!targetContainer) return; // Not on a page that displays courses

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "Active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error.message);
    targetContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: red;">
        Failed to load courses. Please try again later.
      </div>
    `;
    return;
  }

  if (!courses || courses.length === 0) {
    targetContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">
        No courses found. Check back later!
      </div>
    `;
    return;
  }

  targetContainer.innerHTML = courses.map(createCourseCardHTML).join("");
}

document.addEventListener("DOMContentLoaded", loadPublicCourses);
