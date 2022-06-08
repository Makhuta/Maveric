async function GetRole({ guild }) {
  return await new Promise((resolve, reject) => {
    if (!guild) resolve({});
    guild?.roles.fetch().then(async (roles) => {
      let HighestRole;
      let HighestRoleID;
      for (role of roles) {
        console.info(role)
      }
      
      /*
      let RolesList = [];
      for (role of roles) {
        if (role[1].name === permission) {
          RolesList.push({ id: role[0], name: role[1].name });
        }
      }
      if (RolesList.some((r) => r.name === permission)) {
        console.info(RolesList.find((r) => r.name === permission))
        resolve(RolesList.find((r) => r.name === permission));
      } else {
        let CreatedRole = await guild.roles.create({
          name: permission
        });
        resolve(CreatedRole.id);
      }*/
    });
  });
}

module.exports = GetRole;
