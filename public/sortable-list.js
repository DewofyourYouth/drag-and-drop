const sortableList = document.getElementById("sortable");
let draggedItem = null;

sortableList.addEventListener("dragend", (e) => {
  setTimeout(() => {
    e.target.style.display = "";
    draggedItem = null;
  }, 0);
  const sortedList = [];
  for (let child of sortableList.children) {
    sortedList.push(child.innerHTML);
  }
  items = sortedList;
  updateListOrder(sortedList);
});

sortableList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(sortableList, e.clientY);
  document.querySelector(".dragging");
  if (afterElement == null) {
    sortableList.appendChild(draggedItem);
  } else {
    sortableList.insertBefore(draggedItem, afterElement);
  }
});

const showItems = () =>
  fetch("/list").then((res) => {
    res.json().then((items) => {
      appendListItemsToList(items, sortableList);
      sortableList.addEventListener("dragstart", (e) => {
        draggedItem = e.target;
        setTimeout(() => {
          e.target.style.display = "none";
        }, 0);
      });
    });
  });

const getDragAfterElement = (container, y) => {
  const draggableElements = [
    ...container.querySelectorAll("li:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return {
          offset: offset,
          element: child,
        };
      } else {
        return closest;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
};

function appendListItemsToList(items, sortableList) {
  for (let item of items) {
    const element = document.createElement("li");
    element.innerText = item;
    element.setAttribute("draggable", true);
    sortableList.appendChild(element);
  }
}

const updateListOrder = async (items) =>
  fetch("/list", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(items),
  });

showItems();
