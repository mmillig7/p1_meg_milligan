(function () {
  var overlay = document.getElementById('outfit-overlay');
  var dropZone = document.getElementById('drop-zone');
  var mainImg = document.getElementById('dog');
  if (!overlay || !dropZone || !mainImg) return;

  var sideImages = document.querySelectorAll('.sidecolumn1 img, .sidecolumn2 img');

  sideImages.forEach(function (img) {
    img.addEventListener('dragstart', function (e) {
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('text/uri-list', img.src);
      e.dataTransfer.setData('text/plain', img.src);
      img.classList.add('dragging');
    });
    img.addEventListener('dragend', function () {
      img.classList.remove('dragging');
    });
  });

  dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', function () {
    dropZone.classList.remove('drag-over');
  });
  dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    var src = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (src) {
      overlay.src = src;
      overlay.classList.add('visible');
    }
  });
})();
