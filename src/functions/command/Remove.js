async function RemoveCMD({ cmds, NECMD }) {
  await cmds
    .fetch()
    .then(async (cmdslist) => {
      for (individualcmd of cmdslist) {
        if (individualcmd[1].name === NECMD) {
          cmds?.delete(individualcmd[0]);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = RemoveCMD;
