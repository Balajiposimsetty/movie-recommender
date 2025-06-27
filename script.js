function searchMovies() {
  const genre = document.getElementById("genre").value;
  const actor = document.getElementById("actor").value;
  const director = document.getElementById("director").value;
  const liked = document.getElementById("liked").value;

  fetch(`/search?genre=${genre}&actor=${actor}&director=${director}&liked=${liked}`)
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector("#resultsTable tbody");
      tableBody.innerHTML = "";

      if (data.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="5">No movies found</td>`;
        tableBody.appendChild(row);
      } else {
        data.forEach(m => {
          const row = document.createElement("tr");
          row.innerHTML = `<td>${m.title}</td><td>${m.genre}</td><td>${m.director}</td><td>${m.actors}</td><td>${m.rating}</td>`;
          tableBody.appendChild(row);
        });
      }
    })
    .catch(err => {
      console.error("Error fetching movies:", err);
    });
}
