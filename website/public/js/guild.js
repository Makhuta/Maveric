var collapsables = document.getElementsByClassName("guild_stat_text_collapsable");

for (i = 0; i < collapsables.length; i++) {
    collapsables[i].addEventListener("click", function() {
        this.classList.toggle("active_collapsable");
        document.getElementById(`${this.id}_content`).classList.toggle("active");
        document.getElementById(`${this.id}_clear`).classList.toggle("active");
    });
}