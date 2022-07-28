// Initializaions
const btnAddFloor = document.querySelector("#btn-add-floor");
const btnAddLift = document.querySelector("#btn-add-lift");
const btnReset = document.querySelector("#btn-reset");
let floorContainer = document.querySelectorAll(".floor-container");

let numFloors = 0;
let numLift = 1;

// Function to add new lift to ground floor
const addLift = () => {
	// Reference to the ground floor lift container
	const zeroFloorContainer = document.querySelector(
		".floor-container:last-child .floor-lift-container"
	);

	const liftParent = document.createElement("div");
	liftParent.classList.add("lift");
	liftParent.setAttribute("data-current-floor", 0);
	liftParent.innerHTML = `<div class="lift-left"></div>
    <div class="lift-right"></div>`;

	// Append the created lift to the parent node
	zeroFloorContainer.appendChild(liftParent);
};

const handleAddLift = (e) => {
	// If new lift overflows the parent, then return
	if (
		(numLift + 1) * 80 + 16 * numLift >=
		document.querySelector(
			".floor-container:last-child .floor-lift-container"
		).clientWidth
	) {
		return;
	}

	// Increase number of lifts and add new lift to the container
	numLift++;
	addLift();
};

const handleAddFloor = (e) => {
	// Increase number of floors
	numFloors++;

	// Access to lift container and the first child of the container (the top most floor)
	const liftContainer = document.querySelector(".lift-container");
	const liftContainerFirstChild = document.querySelector(
		".floor-container:first-child"
	);

	// Create a new floor node and add HTML content
	const floorContainerNode = document.createElement("div");
	floorContainerNode.className = "floor-container";
	floorContainerNode.setAttribute("data-floor", numFloors);

	floorContainerNode.innerHTML = `
        <div class="floor-buttons">
            <button class="btn" id="btn-down" data-button-floor=${numFloors}>Down</button>
        </div>
        <div class="floor-lift-container">
        </div>
    `;

	// Insert the new floor before the current top most floor
	liftContainer.insertBefore(floorContainerNode, liftContainerFirstChild);

	// Change the 2nd last floor buttons to have Up and Down buttons

	if (numFloors > 1) {
		document
			.querySelector(`.floor-container:nth-child(2)`)
			.querySelector(
				".floor-buttons"
			).innerHTML = `<button class="btn" id="btn-up" data-button-floor=${
			numFloors - 1
		}>Up</button>
        <button class="btn" id="btn-down" data-button-floor=${
			numFloors - 1
		}>Down</button>`;
	}

	// Get references to all the floors and add listener to each of them.
	floorContainer = document.querySelectorAll(".floor-container");
	floorContainer.forEach((floor) => {
		floor.addEventListener("click", callLift);
	});
};

const callLift = (e) => {
	const target = e.target;

	// Event delegation. If the element clicked on the floor is a button, then move and open/ close the doors.
	if (target.classList.contains("btn")) {
		let btnFloor = target.getAttribute("data-button-floor");
		moveLiftToFloor(btnFloor);
	}
};

const initiateOpenCloseDoors = (target) => {
	target.classList.add("open");

	setTimeout(() => {
		target.classList.remove("open");
		target.classList.add("close");

		setTimeout(() => {
			target.classList.remove("close");
			target.classList.remove("busy");
		}, 2500);
	}, 2500);
};

const openLiftDoors = (target, time = 0) => {
	if (target.classList.contains("busy")) {
		return;
	}
	target.classList.add("busy");

	if (time === 0) {
		initiateOpenCloseDoors(target);
		return;
	}

	setTimeout(() => {
		initiateOpenCloseDoors(target);
	}, time * 1000);
};

const moveLiftToFloor = (destFloor) => {
	// Get references to all the lifts.
	const lifts = document.querySelectorAll(".lift");

	for (let i = 0; i < lifts.length; i++) {
		const currentLift = lifts[i];

		// Find the first lift that's not busy.
		if (!currentLift.classList.contains("busy")) {
			const liftFloor = currentLift.getAttribute("data-current-floor");
			const top = parseInt(currentLift.style.top);

			// Move the lift if button clicked not on the same floor.
			const time =
				destFloor === liftFloor
					? 0
					: (Math.abs(destFloor - liftFloor) + 1) * 2;
			if (liftFloor != destFloor) {
				currentLift.style.top = `${
					-172 * (destFloor - liftFloor) + (top ? top : 0)
				}px`;

				currentLift.style.transitionDuration = time + "s";
				currentLift.setAttribute("data-current-floor", destFloor);
			}

			// Open and close doors and return.
			openLiftDoors(currentLift, time);
			return;
		}
	}
};

// Reset the lift container state to initial state with only ground floor and 1 lift.
const handleReset = () => {
	document.querySelector(
		".lift-container"
	).innerHTML = `<div class="floor-container" data-floor="0">
    <div class="floor-buttons">
        <button class="btn" id="btn-up" data-button-floor="0">Up</button>
    </div>
    <div class="floor-lift-container">
        <div class="lift" data-current-floor="0">
            <div class="lift-left"></div>
            <div class="lift-right"></div>
        </div>
    </div>
</div>`;
	numFloors = 0;
	numLift = 0;
};

// Add event listeners to all button
btnAddFloor.addEventListener("click", handleAddFloor);
btnAddLift.addEventListener("click", handleAddLift);
btnReset.addEventListener("click", handleReset);

floorContainer.forEach((floor) => floor.addEventListener("click", callLift));
