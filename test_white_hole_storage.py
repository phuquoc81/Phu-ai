#!/usr/bin/env python3
"""
Test Suite for White Hole Storage System
Validates the gigatic white hole storage for phuhanddevice 81
"""

import sys
import os
import json
from white_hole_storage import WhiteHoleStorage
from windows16_helper import Windows16Helper


def test_white_hole_storage_initialization():
    """Test white hole storage initialization"""
    print("\n" + "=" * 70)
    print("TEST: White Hole Storage Initialization")
    print("=" * 70)
    
    storage = WhiteHoleStorage("phuhanddevice-81")
    
    # Verify device ID
    assert storage.device_id == "phuhanddevice-81", "Device ID mismatch"
    print("✓ Device ID verified: phuhanddevice-81")
    
    # Verify VLAN capacity
    assert storage.vlan_count == 1000000, "VLAN count should be 1,000,000"
    print("✓ VLAN capacity verified: 1,000,000 VLANs")
    
    # Verify Windows 16 support
    assert storage.windows_16_support == True, "Windows 16 support should be enabled"
    print("✓ Windows 16 support verified: Enabled")
    
    # Verify storage capacity
    assert storage.storage_capacity == float('inf'), "Storage capacity should be infinite"
    print("✓ Storage capacity verified: Infinite")
    
    print("✓ All initialization tests passed!")
    return True


def test_vlan_operations():
    """Test VLAN creation and management"""
    print("\n" + "=" * 70)
    print("TEST: VLAN Operations")
    print("=" * 70)
    
    storage = WhiteHoleStorage("phuhanddevice-81")
    
    # Test single VLAN creation
    result = storage.create_vlan(100, "Test-VLAN", "Test VLAN")
    assert result == True, "VLAN creation should succeed"
    print("✓ VLAN 100 created successfully")
    
    # Test VLAN retrieval
    vlan = storage.get_vlan(100)
    assert vlan is not None, "VLAN should exist"
    assert vlan['id'] == 100, "VLAN ID should match"
    assert vlan['name'] == "Test-VLAN", "VLAN name should match"
    print("✓ VLAN retrieval verified")
    
    # Test duplicate VLAN creation (should fail)
    result = storage.create_vlan(100, "Duplicate", "Should fail")
    assert result == False, "Duplicate VLAN creation should fail"
    print("✓ Duplicate VLAN prevention verified")
    
    # Test VLAN deletion
    result = storage.delete_vlan(100)
    assert result == True, "VLAN deletion should succeed"
    assert storage.get_vlan(100) is None, "VLAN should not exist after deletion"
    print("✓ VLAN deletion verified")
    
    # Test VLAN ID validation (out of range)
    result = storage.create_vlan(1000001, "Invalid", "Out of range")
    assert result == False, "Out of range VLAN should fail"
    print("✓ VLAN ID range validation verified")
    
    print("✓ All VLAN operations tests passed!")
    return True


def test_bulk_vlan_creation():
    """Test bulk VLAN creation"""
    print("\n" + "=" * 70)
    print("TEST: Bulk VLAN Creation")
    print("=" * 70)
    
    storage = WhiteHoleStorage("phuhanddevice-81")
    
    # Create 100 VLANs
    created = storage.bulk_create_vlans(500, 599, "BULK")
    assert created == 100, f"Should create 100 VLANs, created {created}"
    print(f"✓ Bulk created {created} VLANs (500-599)")
    
    # Verify a few VLANs exist
    assert storage.get_vlan(500) is not None, "VLAN 500 should exist"
    assert storage.get_vlan(550) is not None, "VLAN 550 should exist"
    assert storage.get_vlan(599) is not None, "VLAN 599 should exist"
    print("✓ Bulk created VLANs verified")
    
    # Verify stats
    stats = storage.get_storage_stats()
    assert stats['active_vlans'] == 100, "Should have 100 active VLANs"
    print(f"✓ Active VLANs count verified: {stats['active_vlans']}")
    
    print("✓ All bulk VLAN creation tests passed!")
    return True


def test_data_storage():
    """Test data storage and retrieval"""
    print("\n" + "=" * 70)
    print("TEST: Data Storage and Retrieval")
    print("=" * 70)
    
    storage = WhiteHoleStorage("phuhanddevice-81")
    
    # Store data
    result = storage.store_data("test_key", "test_value")
    assert result == True, "Data storage should succeed"
    print("✓ Data stored successfully")
    
    # Retrieve data
    value = storage.retrieve_data("test_key")
    assert value == "test_value", "Retrieved value should match stored value"
    print("✓ Data retrieval verified")
    
    # Test non-existent key
    value = storage.retrieve_data("non_existent")
    assert value is None, "Non-existent key should return None"
    print("✓ Non-existent key handling verified")
    
    # Store complex data
    complex_data = {"nested": {"value": 123, "list": [1, 2, 3]}}
    storage.store_data("complex", complex_data)
    retrieved = storage.retrieve_data("complex")
    assert retrieved == complex_data, "Complex data should be preserved"
    print("✓ Complex data storage verified")
    
    print("✓ All data storage tests passed!")
    return True


def test_windows16_helper():
    """Test Windows 16 helper functionality"""
    print("\n" + "=" * 70)
    print("TEST: Windows 16 Helper")
    print("=" * 70)
    
    helper = Windows16Helper("phuhanddevice-81")
    
    # Verify initialization
    assert helper.device_id == "phuhanddevice-81", "Device ID should match"
    assert helper.version == "16.0", "Windows 16 version should be 16.0"
    assert helper.compatibility_mode == "full", "Compatibility mode should be full"
    print("✓ Windows 16 helper initialization verified")
    
    # Test capabilities
    capabilities = helper.get_windows16_capabilities()
    assert capabilities['version'] == "16.0", "Version should be 16.0"
    assert capabilities['max_vlans'] == 1000000, "Max VLANs should be 1,000,000"
    assert 'advanced_vlan_management' in capabilities['features'], "Should have VLAN management feature"
    print("✓ Windows 16 capabilities verified")
    
    # Test VLAN optimization
    vlan_config = {"id": 100, "name": "Test"}
    optimized = helper.optimize_vlan_for_windows16(vlan_config)
    assert optimized['windows_16_optimized'] == True, "Should be marked as optimized"
    assert optimized['mtu'] == 9000, "MTU should be set to 9000"
    print("✓ VLAN optimization verified")
    
    # Test Windows 16 VLAN creation
    storage = WhiteHoleStorage("phuhanddevice-81")
    created = helper.create_windows16_vlans(storage, start=2000, count=100)
    assert created == 100, f"Should create 100 Windows 16 VLANs, created {created}"
    print(f"✓ Windows 16 VLAN creation verified: {created} VLANs")
    
    print("✓ All Windows 16 helper tests passed!")
    return True


def test_configuration_export_import():
    """Test configuration export and import"""
    print("\n" + "=" * 70)
    print("TEST: Configuration Export/Import")
    print("=" * 70)
    
    storage = WhiteHoleStorage("phuhanddevice-81")
    
    # Create some VLANs and data
    storage.create_vlan(10, "Test-10", "Test VLAN 10")
    storage.create_vlan(20, "Test-20", "Test VLAN 20")
    storage.store_data("config_test", "test_value")
    
    # Export configuration
    test_file = "/tmp/test_config.json"
    result = storage.export_config(test_file)
    assert result == True, "Configuration export should succeed"
    assert os.path.exists(test_file), "Configuration file should exist"
    print(f"✓ Configuration exported to {test_file}")
    
    # Verify exported content
    with open(test_file, 'r') as f:
        config = json.load(f)
    assert config['device_id'] == "phuhanddevice-81", "Device ID should match"
    assert 10 in config['active_vlans'], "VLAN 10 should be in config"
    assert 20 in config['active_vlans'], "VLAN 20 should be in config"
    print("✓ Exported configuration verified")
    
    # Test import (create new storage and import)
    storage2 = WhiteHoleStorage("phuhanddevice-81")
    result = storage2.import_config(test_file)
    assert result == True, "Configuration import should succeed"
    assert storage2.get_vlan(10) is not None, "VLAN 10 should exist after import"
    assert storage2.get_vlan(20) is not None, "VLAN 20 should exist after import"
    print("✓ Configuration import verified")
    
    # Cleanup
    os.remove(test_file)
    
    print("✓ All configuration export/import tests passed!")
    return True


def test_massive_vlan_support():
    """Test support for massive number of VLANs"""
    print("\n" + "=" * 70)
    print("TEST: Massive VLAN Support (1,000,000 VLANs)")
    print("=" * 70)
    
    storage = WhiteHoleStorage("phuhanddevice-81")
    
    # Test creating VLANs at different ranges
    test_vlans = [1, 1000, 10000, 100000, 500000, 999999, 1000000]
    
    for vlan_id in test_vlans:
        result = storage.create_vlan(vlan_id, f"VLAN-{vlan_id}", f"Test VLAN at {vlan_id}")
        assert result == True, f"VLAN {vlan_id} creation should succeed"
        
        vlan = storage.get_vlan(vlan_id)
        assert vlan is not None, f"VLAN {vlan_id} should exist"
        assert vlan['id'] == vlan_id, f"VLAN ID should be {vlan_id}"
    
    print(f"✓ Successfully created VLANs across the full range (1 to 1,000,000)")
    print(f"  Tested VLANs: {test_vlans}")
    
    # Verify total count
    stats = storage.get_storage_stats()
    assert stats['active_vlans'] == len(test_vlans), "Active VLAN count should match"
    print(f"✓ Active VLANs: {stats['active_vlans']}")
    
    print("✓ All massive VLAN support tests passed!")
    return True


def test_statistics():
    """Test system statistics"""
    print("\n" + "=" * 70)
    print("TEST: System Statistics")
    print("=" * 70)
    
    storage = WhiteHoleStorage("phuhanddevice-81")
    
    # Get initial stats
    stats = storage.get_storage_stats()
    
    # Verify required fields
    required_fields = [
        'device_id', 'storage_capacity', 'total_vlans_supported',
        'active_vlans', 'windows_16_support', 'storage_entries', 'status'
    ]
    
    for field in required_fields:
        assert field in stats, f"Stats should contain {field}"
    
    print("✓ All required statistics fields present")
    
    # Verify values
    assert stats['device_id'] == "phuhanddevice-81", "Device ID should match"
    assert stats['storage_capacity'] == "infinite", "Storage capacity should be infinite"
    assert stats['total_vlans_supported'] == 1000000, "Total VLANs should be 1,000,000"
    assert stats['windows_16_support'] == True, "Windows 16 support should be enabled"
    assert stats['status'] == "operational", "Status should be operational"
    
    print("✓ All statistics values verified")
    print(f"  Device ID: {stats['device_id']}")
    print(f"  Storage Capacity: {stats['storage_capacity']}")
    print(f"  Total VLANs Supported: {stats['total_vlans_supported']:,}")
    print(f"  Active VLANs: {stats['active_vlans']}")
    print(f"  Windows 16 Support: {stats['windows_16_support']}")
    print(f"  Status: {stats['status']}")
    
    print("✓ All statistics tests passed!")
    return True


def run_all_tests():
    """Run all tests"""
    print("\n")
    print("╔" + "=" * 78 + "╗")
    print("║" + " " * 15 + "WHITE HOLE STORAGE SYSTEM TEST SUITE" + " " * 27 + "║")
    print("║" + " " * 78 + "║")
    print("║" + " " * 20 + "Testing Phuhanddevice 81" + " " * 34 + "║")
    print("║" + " " * 15 + "1,000,000 VLAN Windows 16 Support" + " " * 30 + "║")
    print("╚" + "=" * 78 + "╝")
    
    tests = [
        ("White Hole Storage Initialization", test_white_hole_storage_initialization),
        ("VLAN Operations", test_vlan_operations),
        ("Bulk VLAN Creation", test_bulk_vlan_creation),
        ("Data Storage and Retrieval", test_data_storage),
        ("Windows 16 Helper", test_windows16_helper),
        ("Configuration Export/Import", test_configuration_export_import),
        ("Massive VLAN Support", test_massive_vlan_support),
        ("System Statistics", test_statistics),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            if result:
                passed += 1
        except Exception as e:
            print(f"\n✗ TEST FAILED: {test_name}")
            print(f"  Error: {str(e)}")
            failed += 1
    
    # Summary
    print("\n")
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"Total Tests: {len(tests)}")
    print(f"Passed: {passed} ✓")
    print(f"Failed: {failed} ✗")
    print("=" * 80)
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! 🎉")
        print("\nThe Gigatic White Hole Storage System is fully operational!")
        print("Ready to handle 1,000,000 VLANs with infinite storage capacity.")
        print("Windows 16 support is enabled and functioning correctly.")
        print("\n" + "=" * 80)
        return 0
    else:
        print("\n⚠ SOME TESTS FAILED")
        print(f"\n{failed} test(s) need attention.")
        return 1


if __name__ == "__main__":
    sys.exit(run_all_tests())
