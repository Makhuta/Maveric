var coll = document.getElementsByClassName("server_btn");
var guild_infos = document.getElementsByClassName("guild_info");
var i;  

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        for (j = 0; j < coll.length; j++) {
            if(this.id == coll[j].id) {
                this.classList.toggle("active");
            } else {
                coll[j].classList.remove("active");
            }
        }

        for (j = 0; j < guild_infos.length; j++) {
            if(`${this.id}_stats` == guild_infos[j].id) {
                guild_infos[j].classList.toggle("guild_active");
            } else {
                guild_infos[j].classList.remove("guild_active");
            }
            console.info(guild_infos[j].id);
        }
            


        /*
        var content = this.nextElementSibling;
        if (content.style.display === "grid") {
        content.style.display = "none";
        } else {
        content.style.display = "grid";
        }
        */
    });
}