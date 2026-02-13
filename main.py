"""
Gigatic White Hole Storage Integration for Phuhanddevice 81
Main integration script with 1,000,000 VLAN support and Windows 16 helpers
"""

import sys
import json
from white_hole_storage import WhiteHoleStorage
from windows16_helper import Windows16Helper


def print_banner():
    """Print the system banner"""
    print("=" * 80)
    print(" " * 10 + "GIGATIC WHITE HOLE INTERNAL STORAGE SYSTEM")
    print(" " * 15 + "for Phuhanddevice 81")
    print(" " * 10 + "with 1,000,000 VLAN Windows 16 Support")
    print("=" * 80)
    print()


def load_device_config(config_path: str = "phuhanddevice_81_config.json"):
    """Load device configuration"""
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
        print(f"✓ Configuration loaded from {config_path}")
        return config
    except FileNotFoundError:
        print(f"⚠ Configuration file not found: {config_path}")
        print("  Using default configuration...")
        return None
    except Exception as e:
        print(f"✗ Error loading configuration: {e}")
        return None


def initialize_system():
    """Initialize the complete white hole storage system"""
    print_banner()
    
    # Load configuration
    print("Step 1: Loading Device Configuration")
    print("-" * 80)
    config = load_device_config()
    if config:
        device_info = config.get("device_info", {})
        print(f"  Device ID: {device_info.get('device_id')}")
        print(f"  Device Name: {device_info.get('device_name')}")
        print(f"  Device Type: {device_info.get('device_type')}")
        print(f"  Firmware Version: {device_info.get('firmware_version')}")
    print()
    
    # Initialize White Hole Storage
    print("Step 2: Initializing White Hole Storage")
    print("-" * 80)
    storage = WhiteHoleStorage("phuhanddevice-81")
    stats = storage.get_storage_stats()
    print(f"  Storage Capacity: {stats['storage_capacity']}")
    print(f"  Total VLANs Supported: {stats['total_vlans_supported']:,}")
    print(f"  Windows 16 Support: {stats['windows_16_support']}")
    print(f"  Status: {stats['status']}")
    print()
    
    # Initialize Windows 16 Helper
    print("Step 3: Initializing Windows 16 Helper Services")
    print("-" * 80)
    win16_helper = Windows16Helper("phuhanddevice-81")
    win16_helper.initialize_windows16_support()
    print()
    
    # Validate Windows 16 configuration
    print("Step 4: Validating Windows 16 Configuration")
    print("-" * 80)
    if config:
        is_valid = win16_helper.validate_windows16_config(config)
        if is_valid:
            print("  ✓ Windows 16 configuration is valid")
        else:
            print("  ⚠ Windows 16 configuration validation failed")
    else:
        print("  ⚠ Skipping validation (no config file)")
    print()
    
    # Create essential VLANs
    print("Step 5: Creating Essential VLANs")
    print("-" * 80)
    essential_vlans = [
        (1, "Management-VLAN", "Primary management network for device 81"),
        (10, "Data-VLAN", "Data transfer network"),
        (100, "Voice-VLAN", "Voice communication network"),
        (200, "Storage-VLAN", "White hole storage access network"),
    ]
    
    for vlan_id, name, desc in essential_vlans:
        if storage.create_vlan(vlan_id, name, desc):
            print(f"  ✓ Created VLAN {vlan_id}: {name}")
        else:
            print(f"  ⚠ Failed to create VLAN {vlan_id}")
    print()
    
    # Create Windows 16 optimized VLANs
    print("Step 6: Creating Windows 16 Optimized VLANs")
    print("-" * 80)
    win16_created = win16_helper.create_windows16_vlans(storage, start=1000, count=1000)
    print(f"  ✓ Created {win16_created} Windows 16 optimized VLANs")
    print()
    
    # Store system metadata
    print("Step 7: Storing System Metadata")
    print("-" * 80)
    metadata_items = [
        ("system_version", "1.0.0"),
        ("device_id", "phuhanddevice-81"),
        ("storage_type", "gigatic_white_hole"),
        ("max_vlans", 1000000),
        ("windows_16_enabled", True),
        ("initialization_complete", True)
    ]
    
    for key, value in metadata_items:
        storage.store_data(key, value)
        print(f"  ✓ Stored: {key} = {value}")
    print()
    
    # Create Windows 16 helper script
    print("Step 8: Creating Windows 16 Helper Script")
    print("-" * 80)
    if win16_helper.create_helper_script("windows16_helper.ps1"):
        print("  ✓ PowerShell helper script created: windows16_helper.ps1")
    else:
        print("  ⚠ Failed to create helper script")
    print()
    
    # Export configuration
    print("Step 9: Exporting System Configuration")
    print("-" * 80)
    if storage.export_config("white_hole_config.json"):
        print("  ✓ Configuration exported to: white_hole_config.json")
    else:
        print("  ⚠ Failed to export configuration")
    print()
    
    # Display final statistics
    print("Step 10: Final System Statistics")
    print("-" * 80)
    final_stats = storage.get_storage_stats()
    print(f"  Device ID: {final_stats['device_id']}")
    print(f"  Storage Capacity: {final_stats['storage_capacity']}")
    print(f"  Total VLANs Supported: {final_stats['total_vlans_supported']:,}")
    print(f"  Active VLANs: {final_stats['active_vlans']:,}")
    print(f"  Windows 16 Support: {final_stats['windows_16_support']}")
    print(f"  Storage Entries: {final_stats['storage_entries']}")
    print(f"  System Status: {final_stats['status'].upper()}")
    print()
    
    # Display Windows 16 capabilities
    print("Windows 16 Capabilities:")
    print("-" * 80)
    capabilities = win16_helper.get_windows16_capabilities()
    print(f"  Version: {capabilities['version']}")
    print(f"  Compatibility Mode: {capabilities['compatibility_mode']}")
    print(f"  Max VLANs: {capabilities['max_vlans']:,}")
    print(f"  Storage Integration: {capabilities['storage_integration']}")
    print(f"  Features: {len(capabilities['features'])} enabled")
    for feature in capabilities['features']:
        print(f"    - {feature}")
    print()
    
    # Success banner
    print("=" * 80)
    print(" " * 20 + "SYSTEM INITIALIZATION COMPLETE!")
    print("=" * 80)
    print()
    print("  ✓ Gigatic White Hole Storage: OPERATIONAL")
    print("  ✓ Phuhanddevice 81: READY")
    print(f"  ✓ {storage.vlan_count:,} VLANs: AVAILABLE")
    print("  ✓ Windows 16 Support: ENABLED")
    print("  ✓ Infinite Storage Capacity: ONLINE")
    print()
    print("=" * 80)
    
    return storage, win16_helper


def interactive_menu(storage, win16_helper):
    """Interactive menu for system management"""
    while True:
        print("\n" + "=" * 80)
        print("White Hole Storage Management Menu")
        print("=" * 80)
        print("1. View System Statistics")
        print("2. Create VLAN")
        print("3. View VLAN")
        print("4. Store Data")
        print("5. Retrieve Data")
        print("6. Bulk Create VLANs")
        print("7. Export Configuration")
        print("8. Windows 16 Capabilities")
        print("9. Exit")
        print("-" * 80)
        
        choice = input("Select an option (1-9): ").strip()
        
        if choice == "1":
            stats = storage.get_storage_stats()
            print("\nSystem Statistics:")
            for key, value in stats.items():
                print(f"  {key}: {value}")
        
        elif choice == "2":
            vlan_id = int(input("Enter VLAN ID (1-1000000): "))
            name = input("Enter VLAN name: ")
            desc = input("Enter VLAN description: ")
            if storage.create_vlan(vlan_id, name, desc):
                print(f"✓ VLAN {vlan_id} created successfully")
            else:
                print(f"✗ Failed to create VLAN {vlan_id}")
        
        elif choice == "3":
            vlan_id = int(input("Enter VLAN ID to view: "))
            vlan = storage.get_vlan(vlan_id)
            if vlan:
                print(f"\nVLAN {vlan_id} Details:")
                for key, value in vlan.items():
                    print(f"  {key}: {value}")
            else:
                print(f"VLAN {vlan_id} not found")
        
        elif choice == "4":
            key = input("Enter storage key: ")
            value = input("Enter value: ")
            storage.store_data(key, value)
            print(f"✓ Data stored: {key}")
        
        elif choice == "5":
            key = input("Enter storage key: ")
            value = storage.retrieve_data(key)
            if value is not None:
                print(f"Retrieved: {key} = {value}")
            else:
                print(f"Key not found: {key}")
        
        elif choice == "6":
            start = int(input("Enter start VLAN ID: "))
            end = int(input("Enter end VLAN ID: "))
            prefix = input("Enter VLAN name prefix: ")
            created = storage.bulk_create_vlans(start, end, prefix)
            print(f"✓ Created {created} VLANs")
        
        elif choice == "7":
            filename = input("Enter filename (default: white_hole_config.json): ").strip()
            if not filename:
                filename = "white_hole_config.json"
            if storage.export_config(filename):
                print(f"✓ Configuration exported to {filename}")
            else:
                print(f"✗ Failed to export configuration")
        
        elif choice == "8":
            capabilities = win16_helper.get_windows16_capabilities()
            print("\nWindows 16 Capabilities:")
            for key, value in capabilities.items():
                if isinstance(value, (list, dict)):
                    print(f"  {key}:")
                    if isinstance(value, list):
                        for item in value:
                            print(f"    - {item}")
                    else:
                        for k, v in value.items():
                            print(f"    {k}: {v}")
                else:
                    print(f"  {key}: {value}")
        
        elif choice == "9":
            print("\nShutting down White Hole Storage System...")
            print("Goodbye!")
            break
        
        else:
            print("Invalid option. Please try again.")


def main():
    """Main entry point"""
    # Initialize the system
    storage, win16_helper = initialize_system()
    
    # Check if interactive mode requested
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        interactive_menu(storage, win16_helper)
    else:
        print("Tip: Run with --interactive flag for interactive management menu")
        print()


if __name__ == "__main__":
    main()
