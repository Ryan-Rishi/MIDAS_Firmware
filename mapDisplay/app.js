document.addEventListener('DOMContentLoaded', function() {
  const grid = document.getElementById('grid');
  const tooltip = document.getElementById('tooltip');
  const exportBtn = document.getElementById('exportBtn');

  const centerX = grid.clientWidth / 2;
  const centerY = grid.clientHeight / 2;
  grid.scroll(centerX - window.innerWidth / 2, centerY - window.innerHeight / 2);

  let points = []; // Array to store point data

  function addPoint(offsetX, offsetY) {
    const point = document.createElement('div');
    point.className = 'point';
    point.style.left = `${centerX + offsetX}px`;
    point.style.top = `${centerY + offsetY}px`;
    point.dataset.coords = `(${offsetX}, ${offsetY})`;
    points.push({ long: offsetX, lat: offsetY }); // Store coordinates in array

    point.addEventListener('mouseenter', function(e) {
      tooltip.textContent = `Coords: ${this.dataset.coords}`;
      tooltip.style.display = 'block';
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY + 10}px`;
    });

    point.addEventListener('mouseleave', function() {
      tooltip.style.display = 'none';
    });

    grid.appendChild(point);
  }

  exportBtn.addEventListener('click', function() {
    const worksheet = XLSX.utils.json_to_sheet(points);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Points");
    XLSX.writeFile(workbook, "point_data.xlsx");
  });

  addPoint(0, 0);
});
