// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ドキュメントのタイムスタンプを記録
 * @notice ハッシュ化された書類を登録し、その時点のブロックタイムスタンプを保持
 */
contract DocumentTimestamp {
    error AlreadyRegistered(bytes32 documentHash);
    error NotRegistered(bytes32 documentHash);
    event DocumentRegistered(bytes32 documentHash, uint256 timestamp);

    /// @notice documentHash => 登録ブロックタイムスタンプ
    mapping(bytes32 => uint256) public _timestampOf;

    /**
     * @notice 書類を登録しタイムスタンプを付与
     * @param documentHash 必ずオフチェーンでbytes32で計算したHashを代入
     */
    function register(bytes32 documentHash) public {
        if (isRegistered(documentHash)) {
            revert AlreadyRegistered(documentHash);
        }
        uint256 timestamp = block.timestamp;
        _timestampOf[documentHash] = timestamp;

        emit DocumentRegistered(documentHash, timestamp);
    }

    /**
     * @notice 登録済みのタイムスタンプを取得
     * @param  documentHash 書類のハッシュ
     * @return timestamp 登録時のタイムスタンプ
     */
    function getTimestamp(bytes32 documentHash) public view returns (uint256 timestamp) {
        timestamp = _timestampOf[documentHash];
        if (timestamp == 0) revert NotRegistered(documentHash);
    }

    /**
     * @notice 既に登録済みかどうかを確認
     * @param documentHash 書類のハッシュ
     * @return bool true = 登録ずみ
     */
    function isRegistered(bytes32 documentHash) public view returns (bool) {
        return _timestampOf[documentHash] != 0;
    }
}