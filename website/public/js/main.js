var coll = document.getElementsByClassName("server_btn");
var guild_infos = document.getElementsByClassName("guild_stats");
var collapsables = document.getElementsByClassName("guild_stat_text_collapsable");
var i;
var is_over_server_list = false;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        for (j = 0; j < coll.length; j++) {
            if(this.id == coll[j].id) {
                this.classList.toggle("active_server");
            } else {
                coll[j].classList.remove("active_server");
            }
        }

        for (j = 0; j < guild_infos.length; j++) {
            if(`${this.id}_stats` == guild_infos[j].id) {
                guild_infos[j].classList.toggle("guild_active");
            } else {
                guild_infos[j].classList.remove("guild_active");
            }
        }
    });
}

for (i = 0; i < collapsables.length; i++) {
    collapsables[i].addEventListener("click", function() {
        this.classList.toggle("active_collapsable");
        document.getElementById(`${this.id}_content`).classList.toggle("active");
    });
}


function change_server_list_visibility() {
    if(is_over_server_list) {
        document.getElementsByClassName("servers_list")[0].classList.add("active");
    } else {
        document.getElementsByClassName("servers_list")[0].classList.remove("active");
    }
    is_over_server_list = false;
}

document.getElementsByClassName("menu_btn")[0].addEventListener("mouseover", function() {
    is_over_server_list = true;
    change_server_list_visibility()
})

document.getElementsByClassName("menu_btn")[0].addEventListener("mouseout", function() {
    is_over_server_list = false;
    change_server_list_visibility()
});

document.getElementsByClassName("servers_list")[0].addEventListener("mouseover", function() {
    is_over_server_list = true;
    change_server_list_visibility()
})

document.getElementsByClassName("servers_list")[0].addEventListener("mouseout", function() {
    if(!is_over_server_list) {
        is_over_server_list = false;
        change_server_list_visibility()
    }
})
