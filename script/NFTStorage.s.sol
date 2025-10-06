// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {NFTStorage} from "../src/NFTStorage.sol";

contract NFTStorageScript is Script {
    NFTStorage public counter;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        counter = new NFTStorage(10, "My Kittied", "KITTY");

        vm.stopBroadcast();
    }
}
