const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Timestamp", function () {
    let timestamp;
    const documentHash = toHash("Hello World!!");

    // 各テストの実行前にコントラクトをデプロイし、新しいコントラクトを用意
    beforeEach(async function () {
        const Timestamp = await ethers.getContractFactory("DocumentTimestamp");
        timestamp = await Timestamp.deploy();
        await timestamp.waitForDeployment();
    });

    it("ハッシュを登録し、タイムスタンプを取得", async function () {
        await timestamp.register(documentHash)
        const recipt = await timestamp.getTimestamp(documentHash);
        console.log('書類のタイムスタンプ =>', recipt);
    });

    it("同じハッシュを2回登録するとリバート", async function () {
        await timestamp.register(documentHash);

        await expect(timestamp.register(documentHash))
            .to.be.revertedWithCustomError(timestamp, "AlreadyRegistered")
            .withArgs(documentHash);
    });

    it("未登録ハッシュはリバート", async function () {
        await expect(timestamp.getTimestamp(documentHash))
            .to.be.revertedWithCustomError(timestamp, "NotRegistered")
            .withArgs(documentHash);
    });

    it("ハッシュの重複確認 trueになるべき", async function () {
        await timestamp.register(documentHash);
        expect(await timestamp.isRegistered(documentHash)).to.equal(true);
    });

    it("ハッシュの重複確認 falseになるべき", async function () {
        const documentHash = toHash("check");
        expect(await timestamp.isRegistered(documentHash)).to.equal(false);
    });
});


// 任意の文字列をkeccak256ハッシュ値に変換する
function toHash(text) {
    return ethers.keccak256(ethers.toUtf8Bytes(text));
}
