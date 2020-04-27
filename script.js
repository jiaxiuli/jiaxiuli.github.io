console.clear();

const listEls = Array.from(document.querySelectorAll("li"));
const button = document.querySelector(".nav-button");
const links = Array.from(document.querySelectorAll("li a"));
const listItems = Array.from(document.querySelectorAll("li"));

let menuActive = false;
let mousePos = { x: 0, y: 0 };

links.forEach(item => {
	innerText = item.innerText;
	item.setAttribute("data-text", innerText);
});

button.addEventListener("click", () => {
	menuActive = !menuActive;
	button.classList.toggle("close");
	animateOpenCloseMenu();
});
function animateOpenCloseMenu() {
	let navBG = document.querySelector(".nav__background");
	let tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.45 } });
	if (menuActive) {
		tl.fromTo(
			navBG,
			{ scaleY: 0, transformOrigin: "bottom" },
			{ scaleY: 1, transformOrigin: "top" }
		);
		tl.fromTo(links, { opacity: 0, top: "100%" }, { opacity: 1, top: "0%", stagger: 0.05, delay: -0.35 });
	} else {
		tl.fromTo(links, { opacity: 1, top: "0%" }, { opacity: 0, top: "100%", stagger: -0.05 });
		tl.fromTo(
			navBG,
			{ scaleY: 1, transformOrigin: "top" },
			{ scaleY: 0, transformOrigin: "bottom", delay: -0.35 }
		);
	}
}
animateOpenCloseMenu();

const options = {
	distanceToMove: 15,
};
function updatePos(el) {
	let dist = calculateDistance(el).distance;
	let angle = calculateDistance(el).angle;
	if (dist < 80) {
		options.distanceToMove = dist;
		gsap.to(el, 0.3, {
			x: (Math.cos(angle) * options.distanceToMove) / 2,
			y: (Math.sin(angle) * options.distanceToMove) / 12,
		});
	} else {
		gsap.to(el, 0.3, {
			x: 0,
			y: 0,
		});
	}
}

function calculateDistance(el) {
	let dx = mousePos.x - (el.getBoundingClientRect().left + el.offsetWidth / 2);
	let dy = mousePos.y - (el.getBoundingClientRect().top + el.offsetHeight / 2);
	let angle = Math.atan2(dy, dx);
	let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	return { distance, angle };
}

document.body.addEventListener("mousemove", e => {
	mousePos.x = e.x;
	mousePos.y = e.y;
	if (menuActive) {
		listEls.forEach(listEl => {
			updatePos(listEl);
		});
	}
});