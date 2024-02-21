const sortableList = document.getElementById("sortable");
let draggedItem = null;
let listNames;

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
      listNames = Object.keys(items);
      const itemsList = Object.entries(items).flat((depth = 2));
      appendListItemsToList(itemsList, sortableList);
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
    if (item.includes("tier")) {
      element.setAttribute("class", "tier-heading");
    } else {
      element.setAttribute("draggable", true);
    }
    element.innerText = item;
    sortableList.appendChild(element);
  }
}

const createNewTierObject = (items) => {
  const result = {};
  let currentTier;
  for (let item of items) {
    if (listNames.includes(item)) {
      currentTier = item;
      result[item] = [];
    } else {
      result[currentTier].push(item);
    }
  }
  return result;
};

const updateListOrder = async (items) =>
  fetch("/list", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createNewTierObject(items)),
  });

showItems();
