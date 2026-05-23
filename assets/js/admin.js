/**
 * 25 Hours Platform — Admin Panel
 * Database: Supabase (migrated from Firebase Firestore)
 */

import { supabase } from "./supabase-config.js";

// ─── Load all courses into the admin table ─────────────────────────────────
async function loadAdminCourses() {
  const tableBody = document.getElementById("adminCoursesTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = `
    <tr>
      <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px;">Loading courses...</td>
    </tr>
  `;

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading admin courses:", error.message);
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: red; padding: 32px;">Failed to load courses.</td>
      </tr>
    `;
    return;
  }

  if (!courses || courses.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px;">No courses found. Add one above!</td>
      </tr>
    `;
    return;
  }

  let htmlContent = "";
  courses.forEach((course) => {
    const priceDisplay = course.price === 0 ? "Free" : `₹${course.price}`;
    const statusClass  = course.status === "Active" ? "active" : "inactive";

    htmlContent += `
      <tr>
        <td style="font-weight: 500;">${course.title}</td>
        <td><span class="badge">${course.category}</span></td>
        <td>${priceDisplay}</td>
        <td><span class="badge ${statusClass}">${course.status || "Active"}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn btn-outline" style="padding: 4px 12px; font-size: 11px;" onclick="handleEditCourse('${course.id}')">Edit</button>
            <button class="btn btn-outline" style="padding: 4px 12px; font-size: 11px; color: red; border-color: red;" onclick="handleDeleteCourse('${course.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = htmlContent;
}

// ─── Delete a course ───────────────────────────────────────────────────────
window.handleDeleteCourse = async (id) => {
  if (!confirm("Are you sure you want to delete this course? This cannot be undone.")) return;

  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) {
    console.error("Error deleting course:", error.message);
    alert("Error deleting course. Check console for details.");
    return;
  }

  loadAdminCourses();
};

// ─── Edit stub (placeholder — extend as needed) ────────────────────────────
window.handleEditCourse = (id) => {
  alert(`Edit functionality coming soon! Course ID: ${id}`);
};

// ─── Publish a new course ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadAdminCourses();

  const publishCourseBtn = document.getElementById("publishCourseBtn");

  if (publishCourseBtn) {
    publishCourseBtn.addEventListener("click", async () => {
      const title      = document.getElementById("courseTitle").value.trim();
      const category   = document.getElementById("courseCategory").value;
      const price      = document.getElementById("coursePrice").value;
      const instructor = document.getElementById("courseInstructor").value.trim();
      const duration   = document.getElementById("courseDuration").value.trim();
      const image      = document.getElementById("courseImage").value.trim();

      if (!title || !price || !instructor || !duration) {
        alert("Please fill out all required fields!");
        return;
      }

      const originalText = publishCourseBtn.innerText;
      publishCourseBtn.innerText = "Publishing...";
      publishCourseBtn.disabled = true;

      const { data, error } = await supabase.from("courses").insert([
        {
          title,
          category,
          price:      Number(price),
          instructor,
          duration,
          image:      image || null,
          status:     "Active",
          // created_at is handled by Supabase DEFAULT now()
        },
      ]);

      if (error) {
        console.error("Error publishing course:", error.message);
        alert("Error publishing course. Check console for details.");
      } else {
        alert("Course successfully published!");

        // Reset form fields
        document.getElementById("courseTitle").value      = "";
        document.getElementById("coursePrice").value      = "";
        document.getElementById("courseInstructor").value = "";
        document.getElementById("courseDuration").value   = "";
        document.getElementById("courseImage").value      = "";

        loadAdminCourses();
      }

      publishCourseBtn.innerText = originalText;
      publishCourseBtn.disabled  = false;
    });
  }
});
