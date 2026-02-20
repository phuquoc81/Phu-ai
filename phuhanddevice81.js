/**
 * PhuHand Device 81 - Device configuration module
 * Includes virtual VLAN 50000000 configuration
 */

'use strict';

// Note: VLAN ID 50000000 is a software-defined virtual VLAN identifier.
// It is not a standard IEEE 802.1Q VLAN (range 1-4094) and is used solely
// as a logical overlay network identifier for PhuHand Device 81.
const config = {
  device: 'phuhanddevice81',
  vlan: {
    id: 50000000,
    type: 'virtual',
    name: 'VLAN-50000000',
    description: 'Virtual VLAN 50000000 for PhuHand Device 81',
  },
};

function getConfig() {
  return config;
}

module.exports = { getConfig };
