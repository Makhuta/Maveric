let { join } = require("path");
let ExecuteQuery = require(join(Functions, "DBExecuter.js"));

async function GetRawDatas({ guildIDs }) {
  let sqlSELECT = "SELECT ";
  let sqlFROM = "FROM ";

  for (g in guildIDs) {
    let gID = guildIDs[g];
    if (guildIDs.length - 1 > g) {
      sqlSELECT =
        sqlSELECT +
        `Guild${g}.config_name AS ${gID}_NAME, Guild${g}.config_VALUE AS ${gID}_VALUE, `;
      sqlFROM = sqlFROM + `${gID}_config AS Guild${g}, `;
    } else {
      sqlSELECT =
        sqlSELECT +
        `Guild${g}.config_name AS ${gID}_NAME, Guild${g}.config_VALUE AS ${gID}_VALUE `;
      sqlFROM = sqlFROM + `${gID}_config AS Guild${g} `;
    }
  }

  let sql = sqlSELECT + sqlFROM;

  console.info(sql);
  let GuildConfig = await require(join(Functions, "DBExecuter.js"))({ sql });
  return GuildConfig;
}

async function CreateConfigJSON({ GuildConfig, guildIDs }) {
  for (g in guildIDs) {
    let configs = {};
    let guildID = guildIDs[g];
    for (GCID in GuildConfig) {
      let GC = JSON.parse(JSON.stringify(GuildConfig[GCID]));
      let guildConfigName = GC[`${guildID}_NAME`];
      let guildConfigValue = GC[`${guildID}_VALUE`];

      configs[guildConfigName] = guildConfigValue;
    }
    GuildsConfigs[guildID] = { config: configs };
  }
}

module.exports = async ({ guildIDs }) => {
  let GuildConfig = await GetRawDatas({ guildIDs });

  await CreateConfigJSON({ GuildConfig, guildIDs });
};
