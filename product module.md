Table of Contents

1. Introduction .............................................................................................................................. 5
   1.1. Document Purpose: ........................................................................................................... 5
   1.2. System Overview: .............................................................................................................. 5
   1.3. Document Conventions:..................................................................................................... 5
   1.4. Glossary of Terms:.............................................................................................................. 5
2. System-Wide Configurations...................................................................................................... 6
   2.1. Global Settings................................................................................................................... 6
   2.1.1. Base Currency............................................................................................................. 6
   2.1.2. Tax-Inclusive Pricing ................................................................................................... 7
   2.1.3. Customer Group-Specific Pricing................................................................................. 7
   2.1.4. Product Reviews......................................................................................................... 8
   2.1.5. Inventory Management (Enable/Disable) ................................................................... 8
   2.1.6. Backorders (Enable/Disable)....................................................................................... 9
   2.1.7. SKU Auto-generation Logic ......................................................................................... 9
3. Catalogue Structure and Definitions......................................................................................... 10
   3.1. Module Overview (Scope, Features, Tenant Admin Configurable) .................................... 10
   3.1.1. High-Level Scope and Use Case:................................................................................ 10
   3.1.2. List of Features:........................................................................................................ 10
   3.1.3. Tenant Admin Configurable Features:....................................................................... 10
   3.2. Category Management..................................................................................................... 10
   3.2.1. Categories and Subcategories (Creation, Editing, Hierarchy)..................................... 10
   3.2.2. Category Defaults (Tax Profiles)................................................................................ 11
   3.2.3. Category Listing........................................................................................................ 11
   3.2.4. Pages:....................................................................................................................... 11
   3.2.5. Import/Export .......................................................................................................... 13
   3.3. Division Management ...................................................................................................... 13
   3.3.1. Division Creation/Editing .......................................................................................... 13
   3.3.2. Division Listing.......................................................................................................... 13
   3.3.3. Import/Export .......................................................................................................... 14
   3.4. Units of Measure Management........................................................................................ 14
   3.5. Product Statuses.............................................................................................................. 14
4. Product Management.............................................................................................................. 15
   4.1. Module Overview............................................................................................................. 15
   4.2. List of Features:................................................................................................................ 15
   4.3. Tenant Admin Configurable Features: .............................................................................. 16
   4.4. Product Creation, Editing, and Details .............................................................................. 16
   4.4.1. Key Product Type Definitions:................................................................................... 16
   4.4.2. Product Attributes Management: ............................................................................. 17
   4.4.3. Variant Management (Detailed Considerations - within Product Creation/Editing) ... 20
   4.4.4. Pricing (All Types)..................................................................................................... 22
   4.4.5. Tax Exemption.......................................................................................................... 23
   4.4.6. SEO and Status ......................................................................................................... 23
   4.4.7. Kit Configuration (if applicable) ................................................................................ 23
   4.4.8. Product FAQs............................................................................................................ 23
   4.4.9. "Add New Product" and "Edit Product" Pages........................................................... 24
   4.4.10. User Interaction Flow (Simplified, High-Level):.......................................................... 30
   4.4.11. Validation (Comprehensive): .................................................................................... 30
   4.4.12. "Product Detail Page (PDP) - Frontend (Customer View)".......................................... 31
5. Inventory Management........................................................................................................... 34
   5.1. Module Overview............................................................................................................. 34
   5.1.1. List of Features:........................................................................................................ 34
   5.1.2. Tenant Admin Configurable Features:....................................................................... 36
   5.2. Fulfilment Locations......................................................................................................... 36
   5.2.1. Pages: Add/Edit/List Fulfilment Locations: ................................................................ 36
   5.3. Inventory Tracking and Adjustments................................................................................ 39
   4.3.1. Viewing Inventory (by Product/Location).................................................................. 39
   4.3.2. Manual Adjustments (with Reasons and Audit Trail)................................................. 41
   4.3.3. Receiving Stock (from Purchase Orders - Simplified)................................................. 43
   4.3.4. Handling Returns (to stock, to non-saleable)............................................................. 45
   4.3.5. Managing Holds........................................................................................................ 46
   4.3.6. Serialized Inventory Management ............................................................................ 48
   4.3.7. Lot/Batch Tracking.................................................................................................... 48
   5.4. Low Stock Notifications.................................................................................................... 48
   5.5. Import/Export.................................................................................................................. 49
6. Pricing, Tax, and Channel Configuration................................................................................... 49
   6.1. Module Overview (Scope, Features, Tenant Admin Configurables)................................... 49
   6.1.1. List of Features:........................................................................................................ 49
   6.1.2. Tenant Admin Configurable Features:....................................................................... 50
   6.2. Selling Channels............................................................................................................... 51
   6.2.1. Pages........................................................................................................................ 51
   6.3. Tax Region and Rate Management................................................................................... 52
   6.3.1. Defining Tax Regions, Countries, Rates, and Profiles: ................................................ 52
   6.3.2. Pages........................................................................................................................ 52
   6.4. Customer Groups............................................................................................................. 55
   Pages:...................................................................................................................................... 55
7. Collection Management........................................................................................................... 56
   7.1. Module Overview............................................................................................................. 56
   7.1.1. List of Features:........................................................................................................ 56
   7.1.2. Tenant Admin Configurable Features:....................................................................... 56
   7.2. Collection Creation and Management .............................................................................. 56
   7.2.1. Business Logic and Processes:................................................................................... 56
   7.2.2. Pages:....................................................................................................................... 57
   7.3. Import/Export.................................................................................................................. 59
8. Product Reviews...................................................................................................................... 59
   8.1. Module Overview............................................................................................................. 59
   8.1.1. List of Features:........................................................................................................ 59
   8.1.2. Tenant Admin Configurable Features:....................................................................... 60
   8.2. Review Submission (Customer Perspective) ..................................................................... 60
   8.2.1. Business Logic and Processes:................................................................................... 60
   8.2.2. Pages/UI Elements: .................................................................................................. 60
   8.3. Review Display (Customer Perspective)............................................................................ 62
   8.3.1. Business Logic and Processes:................................................................................... 62
   8.3.2. Pages/UI Elements: .................................................................................................. 62
   8.4. Review Moderation (Admin Panel)................................................................................... 63
   8.4.1. Business Logic and Processes:................................................................................... 63
   8.4.2. Pages:....................................................................................................................... 63
   8.5. Helpfulness Voting (Database and Logic).......................................................................... 64
9. Global FAQs............................................................................................................................. 64
   9.1. Module Overview............................................................................................................. 64
   9.1.1. List of Features:........................................................................................................ 65
   9.1.2. Tenant Admin Configurable Features:....................................................................... 65
   9.2. FAQ Management (Admin Panel) ..................................................................................... 65
   9.2.1. Business Logic and Processes:................................................................................... 65
   9.2.2. Pages........................................................................................................................ 65
   9.3. FAQ Display (Frontend) .................................................................................................... 67
   9.4. Business Logic and Processes: .......................................................................................... 67
   9.5. Page structure example.................................................................................................... 67
10. Currency Management ........................................................................................................ 67
    10.1. Module Overview......................................................................................................... 67
    10.1.1. List of Features:............................................................................................................ 67
    10.1.2. Tenant Admin Configurable Features: .......................................................................... 68
    10.2. Currency and Exchange Rate Management................................................................... 68
    10.2.1. Business Logic and Processes:....................................................................................... 68
    10.2.2. Pages ........................................................................................................................... 68
11. Data Import/Export.............................................................................................................. 70
12. Introduction
    1.1.Document Purpose:
    This Functional Specifications Document (FSD) outlines the detailed requirements and design for
    the Products and Inventory Management module of a new e-commerce platform. This document
    serves as a blueprint for developers, testers, and project stakeholders, providing a comprehensive
    understanding of the system's functionality, data model, and business logic. It covers product
    catalog management, pricing, inventory tracking, tax configuration, and related features. This FSD
    focuses on the functional aspects of the system; it does not cover technical implementation details
    (e.g., specific coding languages, frameworks, or deployment infrastructure).
    1.2.System Overview:
    The e-commerce platform is designed to be a multi-tenant, scalable, and feature-rich system for
    selling products online. The Products and Inventory Management module is a core component of
    this platform, providing the foundation for managing the product catalog, pricing, inventory levels,
    and related configurations. The system supports various product types (regular, variants, kits, and
    potentially downloadable products), flexible pricing models (standard, tiered, volume, step),
    comprehensive tax calculations, and optional inventory tracking. The system supports the
    configuration and management of product reviews, global and product specific FAQs, customer
    groups, and multiple currencies. It's designed to be highly configurable, allowing tenant
    administrators to customize various aspects of the system's behavior.
    1.3.Document Conventions:
     Database table names are written in Pascal_Case (e.g., Products, Product_Categories).
     Database column names are written in snake_case (e.g., product_id, base_price).
     Data types are specified using PostgreSQL syntax (e.g., INT, VARCHAR(255), BOOLEAN,
    DECIMAL(10, 2)).
     ENUM values are written in UPPERCASE (e.g., 'STANDARD', 'TIERED').
     Business logic descriptions use plain English and, where appropriate, pseudo-code to illustrate
    complex logic.
     UI elements are described in terms of their functionality and the data they interact with.
     "Tenant Administrator" refers to a user with administrative privileges within a specific tenant
    instance of the platform.
     "User" refers to a general user or administrator of the system.
     "Customer" refers to end-users/buyers.
    1.4.Glossary of Terms:
     SKU (Stock Keeping Unit): A unique identifier for a sellable product (including variants).
     Variant: A specific version of a product that differs from other versions based on attributes
    like color or size.
     Parent Product: A product that groups together similar variants. Not directly purchasable.
     Regular Product: A standalone product without variants.
     Kit: A product composed of other products (components), potentially with swappable options.
     Collection: A group of products presented together on the storefront (for promotional
    purposes).
     ATP (Available to Promise): The quantity of a product that is available for sale (stock quantity
    minus reserved quantity).
     Tenant: An independent instance of the e-commerce platform, typically representing a single
    business or organization.
     FSD: Functional Specifications Document
     PDP: Product Detail Page
13. System-Wide Configurations
    2.1.Global Settings
    This section defines settings that apply to the entire system (or potentially can be overridden at
    the tenant level).
    2.1.1. Base Currency
    Defines the primary currency used for internal calculations and data storage. All prices in the
    Products and Product_Pricing tables are stored in this base currency. Currency conversions are
    performed based on exchange rates relative to this base currency.
    2.1.1.1. Features:
     Specifies a single base currency for the entire system.
     Used for internal price storage and calculations.
     Facilitates currency conversion.
    2.1.1.2. Tenant Admin Configurable Features:
    The tenant administrator can select the base currency from a predefined list of supported
    currencies (in the Currencies table). This is typically done during initial system setup and should
    not be changed frequently.
    2.1.1.3. Business Logic:
     All price inputs in the admin panel (for products, pricing rules, etc.) are assumed to be in the
    base currency.
     Currency conversion logic uses the base currency as the intermediary for conversions.
    2.1.1.4. Pages:
     "System Settings" Page (or similar): This page will have a dropdown to select the base
    currency from the list of active currencies in the Currencies table.
     Page Structure & Elements:
     Section Title: "Base Currency"
     Dropdown: Labeled "Select Base Currency," populated with active currencies from the
    Currencies table.
     Save Button
     User Interaction Flow:
14. Admin navigates to the System Settings page.
15. Selects the desired base currency from the dropdown.
16. Clicks "Save."
17. The system updates the base currency setting.
    2.1.2. Tax-Inclusive Pricing
    Determines whether product prices entered in the system are inclusive of taxes (e.g., VAT) or
    exclusive of taxes. This affects how prices are displayed to customers and how taxes are calculated.
    2.1.2.1. Features
     Global setting to enable/disable tax-inclusive pricing.
     Category-level override of the global setting.
    2.1.2.2. Tenant Admin Configurable Features:
     Tenant admin can enable/disable tax-inclusive pricing globally.
     Tenant admin can enable/disable tax-inclusive pricing for each category.
    2.1.2.3. Business Logic:
     If tax-inclusive pricing is enabled, the system assumes that all prices entered for products
    (base price and in Product_Pricing) already include the applicable taxes.
     During checkout, the system needs to extract the tax amount from the price to display it
    separately (this is often a legal requirement).
     Price_Excluding_Tax = Price_Including_Tax / (1 + Tax_Rate)
     If tax-inclusive pricing is disabled, prices are treated as exclusive of taxes, and taxes are added
    during checkout.
    2.1.2.4. Pages:
     "System Settings" Page: A global setting (checkbox) to enable/disable tax-inclusive pricing.
     Page Structure, user interaction and field explanation similar to Base Currency section.
     "Add/Edit Category" Pages: A checkbox to enable/disable tax inclusive pricing on the category
    level.
    2.1.3. Customer Group-Specific Pricing
    Allows defining different prices for different groups of customers (e.g., "Retail," "Wholesale"). This
    enables offering discounts or special pricing to specific customer segments.
    2.1.3.1. Features:
     Global on/off switch for customer group-specific pricing.
     Ability to define customer groups.
     Ability to set prices for specific customer groups at the product/variant level.
    2.1.3.2. Tenant Admin Configurable Features:
     Enable/disable customer group-specific pricing globally.
     Create, edit, and delete customer groups.
    2.1.3.3. Business Logic:
    If enabled, the price calculation logic during checkout prioritizes pricing rules associated with the
    customer's group.
    2.1.3.4. Pages:
     "System Settings" Page: A checkbox to enable/disable customer group-specific pricing.
     "Add/Edit Customer Group": Page to manage groups
    2.1.4. Product Reviews
    2.1.4.1. Enable/Disable
     Controls whether the product review functionality is globally enabled or disabled for the
    entire system.
     System-wide on/off switch for product reviews.
     Tenant admin can enable or disable product reviews.
     If disabled, the review submission form and review display sections are not shown on the PDP.
    The review management section in the admin panel is also hidden.
     "System Settings" Page: A checkbox to enable/disable product reviews.
    2.1.4.2. Review Auto-Approval
    Determines whether newly submitted product reviews are automatically approved and displayed
    on the PDP or require manual approval by an administrator.
     System-wide setting for auto-approval or manual approval.
     Tenant admin can choose between auto-approval and manual approval.
     When a review is submitted, its is_approved status is set based on this setting.
     "System Settings" Page: A checkbox or radio buttons to select auto-approval or manual
    approval.
    2.1.5. Inventory Management (Enable/Disable)
    Controls whether the inventory management features are enabled or disabled for the entire system.
     System-wide on/off switch for inventory tracking.
     Tenant admin can enable or disable inventory management.
     If disabled, the inventory-related fields (stock quantity, etc.) are not displayed or used in
    calculations. The system assumes infinite stock.
     If enabled, inventory tracking is active.
     "System Settings" Page: A checkbox to enable/disable inventory management.
    2.1.6. Backorders (Enable/Disable)
    Determines whether customers can place orders for products that are currently out of stock.
     System-wide on/off switch for backorders.
     Tenant admin can enable or disable backorders.
     If disabled, the checkout process prevents orders for out-of-stock items.
     If enabled, out-of-stock items can be ordered, and the backorder_quantity in the Inventory
    table is updated.
     "System Settings" Page: A checkbox to enable/disable backorders.
    2.1.7. SKU Auto-generation Logic
    Defines the rules for automatically generating SKUs for new products and variants. This ensures
    uniqueness and consistency.
     Configurable SKU prefix (e.g., "PROD-", "ITEM-").
     Sequential numbering.
     Optional inclusion of product attributes in the SKU (e.g., color, size codes for variants).
     Preview of generated SKU before saving.
     Tenant admin can define the SKU prefix.
     Tenant admin can choose whether to include product attributes in the SKU.
     Tenant admin can define the format/pattern for the SKU.
     When a new product or variant is created, the system generates a unique SKU based on the
    configured rules.
     The system checks for existing SKUs to prevent duplicates.
     "System Settings" Page (or a dedicated "SKU Settings" page): Fields to configure the SKU
    prefix, attribute inclusion, and other formatting options.
    Page Structure & Elements:
     Section Title: "SKU Generation Settings"
     Text Input: "SKU Prefix"
     Checkboxes/Dropdowns: "Include Product Attributes in SKU" (with options to select which
    attributes)
     Text Input/Pattern Builder: "SKU Format" (e.g., "{prefix}-{product_id}-{attribute_codes}")
     Preview Area: Shows an example of a generated SKU based on the current settings.
     Save Button
    User Interaction Flow:
     Admin navigates to the SKU Settings page.
     Modifies the SKU prefix, attribute inclusion, and format options.
     The preview area updates automatically to show an example.
     Clicks "Save."
     The system updates the SKU generation rules
18. Catalogue Structure and Definitions
    3.1.Module Overview (Scope, Features, Tenant Admin Configurable)
    3.1.1. High-Level Scope and Use Case:
    This module defines the structural elements used to organize and classify products within
    the e-commerce platform. It provides the framework for categorizing products (using a
    hierarchical category/subcategory system), grouping them by business divisions, and
    specifying units of measure. This structure is essential for navigation, search, filtering,
    reporting, and applying various rules (like tax rates) at a category level.
    3.1.2. List of Features:
     Hierarchical Category Management: Create, edit, and delete categories and
    subcategories. Define parent-child relationships between categories.
     Division Management: Create, edit, and delete business divisions.
     Unit of Measure Definition: Create, edit, and delete units of measure (e.g., pieces,
    kilograms, liters).
     Product Status Definition: Define and manage product statuses.
     Category-Level Defaults: Assign default tax rate profiles to categories.
     Active/Inactive Status: Control the visibility of categories, divisions, and UOMs.
     SEO-Friendly URLs (for categories - potentially).
     Import/Export
    3.1.3. Tenant Admin Configurable Features:
     Full control over category and subcategory creation, modification, and deletion.
     Full control over division creation, modification, and deletion.
     Full control over unit of measure creation, modification, and deletion.
     Ability to set default tax rate profiles for categories.
     Ability to define product statuses.
     Ability to activate/deactivate categories, divisions, and UOMs.
    3.2.Category Management
    3.2.1. Categories and Subcategories (Creation, Editing, Hierarchy)
     Categories and subcategories form a two-level hierarchy.
     Each subcategory belongs to exactly one parent category.
     Category and subcategory names must be unique.
     Administrators can create, edit, and delete categories and subcategories.
     Editing a category/subcategory includes modifying its name, description, image, active
    status, and default tax rate profile.
     Deleting a category requires either deleting all associated subcategories and products
    or reassigning them to another category (the UI should provide options for this).
     The system should allow reordering of categories and subcategories (e.g., for
    controlling the display order in navigation menus). This could be implemented with a
    sort_order field (similar to FAQs) or by allowing drag-and-drop reordering in the UI.
     Subcategory names should be unique under a category.
    3.2.2. Category Defaults (Tax Profiles)
     Administrators can optionally assign a default tax rate profile to a category.
     This default profile is used for products within that category unless overridden at the
    product level or by a more specific tax rule.
    3.2.3. Category Listing
     Display all the categories in a list or table format.
     Provide features to filter, sort and search categories.
    3.2.4. Pages:
    3.2.4.1. "Add/Edit Category" Page:
    Form Title: "Add New Category" or "Edit Category"
    Fields:
19. Category Name: (Text Input, Required, Unique)
20. Category Description: (Textarea, Optional)
21. Category Image: (File Upload, Optional)
22. Category Image Alt Text: (Text Input, Optional)
23. Default Tax Rate Profile: (Dropdown, Optional, populated from Tax_Rate_Profiles)
24. Tax Inclusive: (Checkbox)
25. Is Active: (Checkbox, Default: Checked)
26. Save Button
27. Cancel Button
    User Interaction Flow:
28. Admin navigates to the "Add New Category" or "Edit Category" page.
29. Fills in the required fields (Category Name).
30. Optionally fills in the description, uploads an image, and selects a default tax rate
    profile.
31. Sets the "Is Active" status.
32. Clicks "Save."
33. The system validates the input (uniqueness of name, valid tax rate profile, etc.).
34. If validation passes, the category is created/updated in the Product_Categoriestable.
35. If validation fails, error messages are displayed.
    3.2.4.2. "Add/Edit Subcategory" Page:
    Form Title: "Add New Subcategory" or "Edit Subcategory"
    Fields:
36. Parent Category: (Dropdown, Required, populated from Product_Categories)
37. Subcategory Name: (Text Input, Required, Unique within the parent category)
38. Subcategory Description: (Textarea, Optional)
39. Subcategory Image: (File Upload, Optional)
40. Subcategory Image Alt Text: (Text Input, Optional)
41. Is Active: (Checkbox, Default: Checked)
42. Save Button
43. Cancel Button
    User Interaction Flow:
44. Admin navigates to the "Add New Subcategory" or "Edit Subcategory" page.
45. Selects the parent category from the dropdown.
46. Fills in the required fields (Subcategory Name).
47. Optionally fills in the description and uploads an image.
48. Sets the "Is Active" status.
49. Clicks "Save."
50. The system validates the input.
51. If validation passes, the subcategory is created/updated in the Subcategories table.
52. If validation fails, error messages are displayed.
    3.2.4.3. Category Listing Page
    Page Structure & Elements:
     Table/List displaying all the categories.
     Columns like Category ID, Category Name, Description, Image, Is Active, Actions
    (Edit, Delete).
     Search bar to search by category names.
     Sort options (Category Name, ID)
     Pagination if many records are available.
     "Add New Category" button.
    User Interaction Flow:
53. Admin navigates to Category listing page.
54. Can view, search, and sort all categories.
55. Can click on Add New Category, Edit or Delete actions.
    3.2.5. Import/Export
     Allow administrators to import categories and subcategories from a CSV file.
     CSV Format: Columns for category name, description, image URL, is_active, parent
    category (for subcategories).
     Validation: Ensure category names are unique; parent categories exist for
    subcategories.
     Allow administrators to export category and subcategory data to a CSV file.
    3.3.Division Management
    3.3.1. Division Creation/Editing
     Administrators can create, edit, and delete divisions.
     Division names must be unique.
     Editing a division includes modifying its name, description, image, and active status.
    "Add/Edit Division" Page:
    Form Title: "Add New Division" or "Edit Division"
    Fields:
56. Division Name: (Text Input, Required, Unique)
57. Division Description: (Textarea, Optional)
58. Division Image: (File upload, Optional)
59. Division Image Alt Text: (Text Input, Optional)
60. Is Active: (Checkbox, Default: Checked)
61. Save Button
62. Cancel Button
    User Interaction Flow: (Similar to Category creation/editing)
    3.3.2. Division Listing
     Lists out all defined divisions.
     Provides functionalities to add, edit and delete.
    Page Structure & Elements:
     Table/List displaying all the divisions.
     Columns like Division ID, Division Name, Description, Image, Is Active, Actions (Edit,
    Delete).
     Search bar to search by division names.
     Sort options (Division Name, ID)
     Pagination if many records are available.
     "Add New Division" button.
    User Interaction Flow:
63. Admin navigates to Division listing page.
64. Can view, search, sort all divisions.
65. Can click on Add New Division, Edit or Delete actions.
    3.3.3. Import/Export
     Import: Allow administrators to import divisions from a CSV file.
     CSV Format: Columns for division name, description, image URL, is_active,.
     Validation: Ensure division names are unique.
     Export: Allow administrators to export division data to a CSV file.
    3.4.Units of Measure Management
    "Add/Edit Unit of Measure"
    Form Title: "Add New Unit of Measure" or "Edit Unit of Measure"
    Fields:
     UOM Code: (Text Input, Required, Unique, Short - e.g., "PCS")
     UOM Name: (Text Input, Required, Unique - e.g., "Pieces")
     UOM Type: ENUM with values DISCRETE and CONTINUOUS
     Is Active: (Checkbox, Default: Checked)
     Save Button
     Cancel Button
    3.5.Product Statuses
    Add/Edit product statuses with details including status code, status name and if its
    orderable.
    Form Title: "Add New Product Status" or "Edit Product Status"
    Fields:
     Status Name: (Text Input, Required, Unique - e.g., "New")
     Is Orderable: (Checkbox, Default: Checked)
     Save Button
     Cancel Button
66. Product Management
    4.1.Module Overview
    This module provides the core functionality for managing the product catalog within the
    e-commerce platform. It encompasses all aspects of product definition, from basic
    information and categorization to complex variations, pricing strategies, and associated
    metadata. This module allows administrators to create, edit, organize, and configure
    products for sale. The product catalog is the foundation of the entire e-commerce system,
    and this module ensures its accuracy, completeness, and maintainability.
    4.2.List of Features:
     Create and edit products of various types:
    o Regular Products: Standalone, individually purchasable items.
    o Parent Products: Non-purchasable groupings for variants.
    o Variant Products: Specific, purchasable variations of a parent product (e.g.,
    different sizes/colors).
    o Kit Products: Purchasable products composed of other products (with fixed or
    dynamic pricing).
     Define core product attributes (name, description, SKU, etc.).
     Manage product images (upload, reorder, set primary image, alt text).
     Assign products to categories and subcategories (hierarchical structure).
     Assign products to divisions (business units).
     Define and manage product-specific attributes (custom fields) with:
    o Various data types (Text, Number, Boolean, Date, Select, Multi-Select).
    o Validation rules (required, min/max length, allowed values, etc.).
    o Control over display on the Product Detail Page (PDP).
    o Option to use attributes for defining variants.
    o Attribute Groups
     Manage product variants, including:
    o Defining variant-defining attributes.
    o Creating/editing/deleting/deactivating individual variants.
    o Setting variant-specific prices, images, and inventory.
     Configure pricing, including support for:
    o Standard pricing (single price).
    o Tiered pricing (different prices for different quantity ranges).
    o Volume pricing (percentage discounts based on quantity).
    o Step pricing (fixed prices for specific quantity ranges).
    o Customer group-specific pricing.
    o Selling channel-specific pricing.
     Set a base price for quick display.
     Manage product status (e.g., "New," "Available," "Discontinued," "Pre-Order," "Out of
    Stock").
     Define SEO-related information (URL slug, meta description - future).
     Manage product-specific FAQs.
     Mark products as tax-exempt.
     Specify units of measure (UOM).
     Indicate if a product is serialized or lot-tracked.
     Mark a product as downloadable.
     Configure weight and dimensions (for shipping).
     Define and manage kits, including:
    o Base components (required components).
    o Swappable components (allowing customers to choose from options).
    o Fixed or dynamic kit pricing.
     Product Import/Export
    4.3.Tenant Admin Configurable Features:
     Definition of custom product attributes (name, data type, validation rules, display
    properties).
     Definition of available product statuses.
     Configuration of SKU auto-generation rules (through global settings).
     Definition of available UOMs
    4.4.Product Creation, Editing, and Details
    4.4.1. Key Product Type Definitions:
     Regular Product: A standalone, directly purchasable item with its own SKU, price, and
    inventory. It does not have any variations or components. Examples: a specific book,
    a single electronic gadget, a specific piece of furniture. Think of it as the simplest type
    of product.
     Parent Product: A non-purchasable product that serves to group together similar
    products called variants. The parent product holds all the information that is common
    to all its variants (e.g., the general description, images that apply to all variants, the
    base product name). A parent product cannot be added to the cart directly by a
    customer. It has its own SKU in the system (for internal organization), but this SKU is
    not used for sales. Example: "T-Shirt" (this is the parent). The individual, purchasable
    T-shirts (Red-Small, Blue-Large, etc.) are the variants.
     Variant Product: A purchasable variation of a parent product. Each variant must
    belong to a parent product. Variants represent the specific, concrete items that
    customers can buy. Each variant has its own:
    o Unique SKU
    o Price (can be different from other variants)
    o Inventory (tracked separately for each variant)
    o Potentially unique images (e.g., a picture of the red T-shirt)
    o Values for the variant-defining attributes. These attributes are what
    distinguish one variant from another (e.g., color, size, material). Examples: "TShirt - Red - Small," "T-Shirt - Blue - Large."
     Kit Product: A purchasable product that is made up of other products (which can be
    Regular Products or Variant Products). Think of it as a bundle or a package deal. Kits
    have their own SKU and price. Key features of kits:
    o Base Components: These are the core components that are always included in
    the kit. They are a fixed part of the kit's configuration.
    o Swappable Components: These components allow for customer choice.
    Instead of a single, fixed component, a swappable component presents the
    customer with a set of options. For example, a "Computer Kit" might have a
    base component of "Motherboard" and a swappable component for "Graphics
    Card," where the customer can choose from several different graphics card
    models (each a variant of a "Graphics Card" parent product). The choice of
    swappable component can affect the final price of the kit.
    o Fixed vs. Dynamic Pricing: A kit can have a fixed price (set by the administrator),
    or its price can be calculated dynamically based on the prices of its components
    (and any price adjustments for swappable components).
     Collection: A collection is a grouping of existing products for display and promotional
    purposes. It's not a purchasable item itself. Customers buy the individual products
    within the collection, not the collection as a whole. Examples: "Summer Collection,"
    "New Arrivals," "Gift Ideas."
    4.4.2. Product Attributes Management:
    2.1.4.3. Module Overview (Scope, Features):
    Scope: This section describes how product attributes (custom fields) are defined and
    managed globally within the system, before they are assigned to individual products.
    Features:
     Create, edit, and delete product attributes.
     Define attribute data types:
    o TEXT: General text input.
    o NUMBER: Numeric input (integer or decimal).
    o BOOLEAN: True/False (checkbox).
    o DATE: Date input (with a date picker).
    o SELECT: Dropdown list with predefined options.
    o MULTI_SELECT: Allows selecting multiple options from a predefined list.
     Specify validation rules per attribute (e.g., required, min/max length, allowed
    values).
     Indicate whether an attribute can be used to define variants ("Use for Variants"
    flag).
     Control whether an attribute is displayed on the Product Detail Page (PDP)
    ("Display on PDP" flag).
     Organize attributes into groups (e.g., "Technical Specifications," "Dimensions").
     Attribute Listing.
    2.1.4.4. Pages:
     "Add/Edit Product Attribute" Page:
    o Page Purpose: Allows administrators to define new product attributes or
    modify existing ones.
    o Page Structure and Elements:
    Field Type Required Validation Description
    Attribute
    Name
    Text Input Yes Unique, Max Length: 255 The internal name of the
    attribute (e.g., "Material",
    "Weight").
    Attribute
    Code
    Text Input Yes Max Length: 255,
    Alphanumeric and
    underscore
    Internal code
    Attribute
    Label
    Text Input Yes Max Length: 255 Display name.
    Attribute
    Description
    Textarea No Max Length: (e.g., 1024) Description
    Data Type Dropdown Yes Must be one of: 'TEXT',
    'NUMBER', 'BOOLEAN',
    'DATE', 'SELECT',
    'MULTI_SELECT'
    Determines the type of
    data and the
    corresponding input field.
    Validation
    Rules
    (Varies) No (Dependent on Data
    Type)
    See detailed breakdown
    below.
    Use for
    Variants
    Checkbox No N/A If checked, this attribute
    can be used to define
    product variants.
    Display on
    PDP
    Checkbox No N/A If checked, the attribute
    and its value will be
    displayed on the product
    detail page.
    Attribute
    Group Dropdown/Select
    No Allows grouping attributes
    for organization (e.g.,
    "Technical Specifications",
    "Dimensions").
    Is Active Checkbox Yes Default: Checked Determines whether the
    attribute is available for
    assignment to products.
    Save Button N/A N/A Submits the form to
    create/update the
    attribute.
    Cancel Button N/A N/A Returns to the Attribute
    List page without saving.
     Validation Rules (Details by Data Type):
    o TEXT:
     Required (Checkbox)
     Min Length (Numeric Input)
     Max Length (Numeric Input)
     Regular Expression (Text Input - for advanced pattern matching)
    o NUMBER:
     Required (Checkbox)
     Minimum Value (Numeric Input)
     Maximum Value (Numeric Input)
     Integer Only (Checkbox)
    o BOOLEAN:
     Required (Checkbox) - Note: A required boolean is usually a bad design;
    consider carefully if this is truly needed.
    o DATE:
     Required (Checkbox)
     Minimum Date (Date Picker)
     Maximum Date (Date Picker)
    o SELECT:
     Required (Checkbox)
     Options (List Input - a list of allowed values, each with a label and a
    value. The UI should allow adding, editing, deleting, and reordering
    options.)
    o MULTI_SELECT:
     Required (Checkbox)
     Options (List Input - a list of allowed values, each with a label and a
    value. The UI should allow adding, editing, deleting and reordering
    options.)
     Minimum Selections (Numeric Input)
     Maximum Selections (Numeric Input)
     "Product Attribute List" Page:
    o Page Purpose: Displays a list of all defined product attributes, allowing
    administrators to manage them.
    o Page Structure and Elements:
     Table/List displaying all attributes.
     Columns: Attribute ID, Attribute Name, Attribute Code, Attribute Label,
    Data Type, Use for Variants, Display on PDP, Is Active, Actions (Edit,
    Delete).
     Search bar (to search by attribute name).
     Filtering (e.g., by data type, by "Use for Variants").
     Sorting (by name, data type).
     Pagination (if necessary).
     "Add New Attribute" button.
    4.4.3. Variant Management (Detailed Considerations - within Product Creation/Editing)
    2.1.4.5. Creating Variants:
     The administrator first selects the variant-defining attributes for the parent product
    (from the attributes marked as "Use for Variants"). For example, they might select
    "Colour" and "Size."
     The system then presents input fields for each selected attribute. If the attribute is of
    type SELECT or MULTI_SELECT, the options are presented as dropdowns. If it's TEXT,
    NUMBER, or DATE, appropriate input fields are shown.
     The administrator can enter multiple values for each attribute. For example, for
    "Colour," they might enter "Red," "Blue," "Green." For "Size," they might enter
    "Small," "Medium," "Large."
     The system then generates all possible combinations of these attribute values. Each
    combination represents a distinct variant. (Example: Red-Small, Red-Medium, RedLarge, Blue-Small, Blue-Medium, Blue-Large, etc.)
     For each generated variant, the system creates a row in a variant management
    grid/table (within the "Add/Edit Product" page). This grid allows the administrator to
    further customize each variant.
    2.1.4.6. Variant Grid/Table (Columns):
     Variant-Defining Attributes: Columns for each selected attribute (e.g., Color, Size),
    displaying the specific values for that variant.
     SKU: (Auto-generated based on system settings, but overridable).
     Base Price: (Numeric input).
     Is Active: (Checkbox).
     Image: (Option to select a variant-specific image, or inherit from the parent
    product).
     Tax Code: (Dropdown - if different tax rates apply to different variants)
     Weight, Height, Length, Width: If different from parent product.
     UOM: If different from parent.
     Status: (Dropdown)
     Other Variant-Specific Fields: (As needed - you could potentially allow overriding
    the description, summary, etc., for individual variants).
     Delete: A button to delete the variant. (Should be allowed only if it’s not a part of
    any order-new or old).
    2.1.4.7. Editing Variants:
    Variants can be individually edited via the variant grid. Changes made to a variant only
    affect that specific variant.
    2.1.4.8. Deleting Variants:
     When a variant is deleted, the corresponding record in the Products table (where
    product_type = 'VARIANT') is removed (or marked as inactive, if using soft deletes).
     Any associated Inventory records are also marked as inactive or handled according
    to your inventory deletion policy.
     Any existing orders that include the deleted variant should be flagged for review.
    The system must not automatically cancel orders. This requires manual
    intervention by an administrator.
    2.1.4.9. Deactivating Variants:
    Deactivating a variant (using the "Is Active" checkbox) makes it unavailable for purchase
    but retains the data. This is useful for temporarily removing a variant from sale (e.g., if it's
    out of stock and you don't want to track backorders). A deactivated variant can be
    reactivated later.
    2.1.4.10. Changing Variant-Defining Attributes:
     This is a complex operation that should be handled with extreme caution. If an
    administrator tries to change the attributes that define variants after variants have
    already been created, the system must:
     Issue a Strong Warning: Explain that this change could have serious consequences
    (data loss or inconsistencies).
     Provide Options (with clear explanations of the implications):
    o Prevent the Change: The safest option. The administrator must first delete
    all existing variants before changing the defining attributes.
    o Allow the Change and Delete All Existing Variants: This is a drastic option
    but ensures data consistency. All existing variant data is lost.
    o Attempt to Remap Variants (NOT RECOMMENDED): This is extremely
    complex and error-prone. The system would need to try to intelligently
    match existing variant data to the new attribute combinations. This is very
    difficult to do reliably and is generally not recommended.
    4.4.4. Pricing (All Types)
     As described in previous responses, this section allows configuring Standard, Tiered,
    Volume, and Step pricing.
     Channel-Specific Pricing: The UI allows selecting a specific selling channel (or "All
    Channels") for each pricing rule. This allows for different prices on different platforms
    (e.g., website vs. mobile app vs. marketplace).
     Customer Group-Specific Pricing: If the global setting for customer group-specific
    pricing is enabled, the UI allows selecting a specific customer group (or "All
    Customers") for each pricing rule.
     Price Calculation Logic (Checkout): The checkout process prioritizes pricing rules as
    follows:
67. Channel-Specific AND Customer Group-Specific rules.
68. Channel-Specific rules (no customer group).
69. Customer Group-Specific rules (no channel).
70. Default rules (no channel, no customer group).
    4.4.5. Tax Exemption
    A simple checkbox ("Tax Exempt") allows marking a product as exempt from all taxes.
    4.4.6. SEO and Status
     SEO Fields: (Currently, only url_slug is implemented; meta title and meta description
    are future enhancements).
     Product Status: A dropdown allows selecting the product's status (e.g., "New,"
    "Available," "Discontinued") from the options defined in the Product_Statuses table.
    This is separate from the Is Active checkbox. The is_orderable field in
    Product_Statuses controls whether products with a given status can be ordered,
    regardless of inventory levels.
    4.4.7. Kit Configuration (if applicable)
     Only displayed if Product Type is 'KIT'.
     Base Components: A section to add required components to the kit. For each
    component:
    o Product Selection: (Searchable dropdown/product picker).
    o Quantity: (Numeric input).
     Swappable Components:
    o "Add Swappable Component Group" button.
    o When clicked, displays a product selection modal, allowing the administrator
    to select a parent product. All variants of that parent product become the
    swappable options.
    o For each variant of the selected parent product:
     price_adjustment: (Numeric input, can be positive or negative) -
    Represents the price difference compared to the default variant in the
    swappable set.
    o The system implicitly groups swappable components based on the parent
    product they belong to.
     Fixed vs Dynamic Kit Pricing:
    o Radio buttons to choose how the kit is priced:
     Fixed: The price is entered directly in the Base Price field on the General
    Tab.
     Dynamic: The kit price will be automatically calculated based on the
    sum of the selected component's price.
    4.4.8. Product FAQs
     A section to add, edit, delete, and reorder product-specific FAQs.
     Each FAQ has a question (text input) and an answer (rich text editor).
    4.4.9. "Add New Product" and "Edit Product" Pages
     Page Purpose:
    o Add New Product: Allows administrators to create new products in the catalog.
    o Edit Product: Allows administrators to modify the details of existing products.
     Page Access:
    o Accessed from the "Product Management" section of the admin panel (e.g.,
    via a navigation menu link like "Products" and then an "Add New Product"
    button or by clicking an "Edit" button on a product listing).
     Page Structure and Elements:
    The page is a comprehensive form with multiple sections, organized using tabs or
    accordions for better usability. This structure is largely identical for both "Add New
    Product" and "Edit Product," with the key difference being that "Edit Product" prepopulates the fields with existing data.
    A. General Information Tab/Section:
    Field Type Required Validation Description
    Product Type
    Dropdown
    Yes Must be one of:
    'REGULAR',
    'PARENT', 'KIT'
    Determines the type of product.
    This choice dynamically affects
    which other fields are displayed on
    the page. If changed on "Edit
    Product" after variants/kits are set
    up, a warning is shown, and data
    may be lost/reconfigured.
    Product
    Name
    Text Input Yes Max Length: 255 The name of the product (displayed
    to customers).
    Product
    Summary
    Text area No Max Length: (e.g.,

1024) A short description (used for search
      results, category pages, etc.).
      Product
      Description
      Rich Text
      Editor
      No (Large text field) A detailed description of the
      product (shown on the PDP). Should
      support rich text formatting (bold,
      italics, lists, links, etc.).
      SKU Text Input Yes Unique Stock Keeping Unit. Auto-generated
      based on system settings, but
      overridable by the administrator.
      Uniqueness must be enforced
      across all products (Regular,
      Variants, Kits).
      Category
      Dropdown
      Yes Must be a valid
      category_id
      Selects the product's category.
      Subcategory
      Dropdown
      Yes Must be a valid
      subcategory_id
      under the
      category.
      Selects the product's subcategory.
      The options in this dropdown are
      dynamically filtered based on the
      selected Category.
      Division
      Dropdown
      Yes Must be a valid
      division_id
      Selects the product's division.
      Base Price Numeric
      Input
      Yes (for
      REGULAR,
      VARIANT), No
      (for PARENT,
      KIT)
      Decimal (e.g.,
      10.00)
      The base/default price of the
      product (in the base currency). For
      Kits, this field is only used if "Fixed"
      pricing is chosen.
      URL Slug Text Input Yes Unique Auto-generated based on Product
      Name (lowercase, spaces to
      hyphens, remove special
      characters), but overridable.
      Uniqueness is enforced; duplicates
      are handled by appending a number
      (e.g., -1, -2).
      Is Active Checkbox Yes Default: Checked Determines whether the product is
      visible on the storefront.
      Tax Exempt Checkbox No Default:
      Unchecked
      Indicates whether the product is
      exempt from all taxes.
      Unit of
      Measure
      (UOM)
      Dropdown
      Yes (for
      REGULAR,
      VARIANT), No
      (for PARENT,
      KIT)
      Must be a valid
      uom_code
      Selects the unit of measure for the
      product (e.g., "Pieces," "Kilograms,"
      "Liters"). Options are populated
      from the Units_Of_Measure table.
      Is Serialized Checkbox No Default:
      Unchecked
      Indicates whether the product uses
      serialized inventory tracking.
      Is Lotted Checkbox No Default:
      Unchecked
      Indicates whether the product uses
      lot/batch tracking.
      Product
      Status Dropdown
      Yes Must be a valid
      status_code
      Selects the product's status (e.g.,
      "New," "Available," "Discontinued,"
      "Pre-Order," "Out of Stock").
      Options are populated from the
      Product_Statuses table. This is
      distinct from Is Active.
      B. Images Tab/Section:
       Functionality to upload multiple images.
       For each image:
      o File Upload field (supports common image formats: jpg, png, gif, etc.).
      o Alt Text input (Text Input, Required).
      o "Set as Primary" checkbox (only one image can be primary at a time).
      o Sort Order input (Numeric Input) or drag-and-drop reordering functionality.
      o Delete button.
      C. Attributes Tab/Section:
       Displays a list of available custom attributes (from the Product_Attributes table,
      filtered to show only those marked as is_active).
       For each attribute:
      o A label showing the attribute_label.
      o An input field appropriate for the attribute's data_type:
       TEXT: Text Input
       NUMBER: Numeric Input
       BOOLEAN: Checkbox
       DATE: Date Picker
       SELECT: Dropdown (populated with options from
      Product_Attribute_Options)
       MULTI_SELECT: Multi-select dropdown (or checkboxes) (populated
      with options from Product_Attribute_Options)
      o The system enforces any validation rules defined for the attribute (e.g.,
      required, min/max length, allowed values).
      D. Variants Tab/Section (Only displayed if Product Type is 'PARENT'):
       Variant-Defining Attributes:
      A section to select the attributes that will define variants (e.g., "Color," "Size"). This
      should be a selection from the attributes that are marked as "Use for Variants" in the
      Product_Attributes table.
       Variant Grid/Table:
      o A grid or table is used to create, manage, and view individual variants.
      o Each row represents a variant.
      o Columns:
       Variant-Defining Attribute Values: Columns for each selected attribute
      (e.g., Color, Size). The input fields in these columns will depend on the
      attribute's data type (dropdowns for SELECT and MULTI_SELECT, text
      inputs for TEXT, etc.).
       SKU: (Auto-generated based on system settings and the variant
      attribute values, but overridable by the administrator).
       Base Price: (Numeric input).
       Is Active: (Checkbox).
       Image: (Option to select a variant-specific image, or inherit from the
      parent product).
       Tax Code: (Dropdown - optional, for variant-specific tax codes).
       Weight, Height, Length, Width: If variant values are different.
       UOM: If variant value is different.
       Status: Dropdown
       (Other variant-specific fields, as needed).
      o "Add Variant" Button: Adds a new row to the grid, allowing the administrator
      to define a new variant.
      o "Delete" Button (per row): Deletes the corresponding variant (with
      appropriate confirmation and handling of inventory/orders, as described
      previously).
       Variant Generation:
      o Once the attributes are added, a grid that contains variants based on attributes
      should be displayed.
      E. Pricing Tab/Section (Only displayed if Product Type is 'REGULAR' or 'VARIANT'):
       Default Pricing:
      o Label: "Default Pricing (Applies to all channels and customer groups unless
      overridden)"
      o Pricing Type: Dropdown (Options: Standard, Tiered, Volume, Step).
      o Fields based on Pricing Type (dynamically shown/hidden):
       Standard:
       Price (Numeric Input)
       Tiered:
       Table with columns: Start Quantity, End Quantity, Price
       "Add Tier" button (adds a new row to the table)
       "Delete" button (per row)
       Volume:
       Table with columns: Start Quantity, End Quantity, Discount
      Percentage
       "Add Level" button
       "Delete" button (per row)
       Step:
       Table with columns: Start Quantity, End Quantity, Price
       "Add Step" button
       "Delete" button (per row)
      o Channel-Specific Pricing:
       "Add Channel Override" button.
       When clicked, displays:
       Channel selection (Dropdown, populated from
      Selling_Channels).
       Pricing Type (Dropdown - Standard, Tiered, Volume, Step).
       Fields based on Pricing Type (same as Default Pricing, above).
       A table/list displays existing channel overrides, with options to edit or
      delete them.
      o Customer Group-Specific Pricing: (Only displayed if customer group-specific
      pricing is enabled globally)
       "Add Customer Group Override" button.
       When clicked, displays:
       Customer Group selection (Dropdown, populated from
      Customer_Groups).
       Pricing Type (Dropdown - Standard, Tiered, Volume, Step).
       Fields based on Pricing Type (same as Default Pricing, above).
       A table/list displays existing customer group overrides, with options to
      edit or delete them.
      F. Kit Components Tab/Section (Only displayed if Product Type is 'KIT'):
       Kit Pricing Type:
      o Radio buttons: Fixed, Dynamic
       If Fixed is chosen, Base Price on General tab will be enabled.
       If Dynamic is chosen, Base Price on General tab will be disabled.
       Base Components:
      o "Add Base Component" button.
      o When clicked, displays a product selection modal (searchable dropdown or
      product picker).
      o For each selected base component:
       Product: (Read-only, displays the selected product).
       Quantity: (Numeric input).
       Swappable Components:
      o "Add Swappable Component Group" button.
      o When clicked:
       Displays a product selection modal, allowing the administrator to select
      a parent product.
      o Once a parent product is selected:
       All variants of that parent product are displayed as options within that
      swappable component group.
       For each variant:
       Variant Name: (Read-only).
       Price Adjustment: (Numeric input, can be positive or negative)

- Indicates how selecting this variant affects the kit's final price
  (only relevant for dynamic pricing).
  G. FAQs Tab/Section:
   "Add New FAQ" button.
   When clicked, displays:
  o Question: (Text Input).
  o Answer: (Rich Text Editor).
   A list displays existing FAQs for the product, with:
  o Question (display).
  o Answer (display).
  o Sort Order (input or drag-and-drop).
  o Edit/Delete buttons.
  H. Buttons (at the bottom of the form):
   Save: Saves the product data (creates a new product or updates an existing one).
  Performs validation (required fields, data types, uniqueness, pricing rule consistency,
  etc.).
   Cancel: Returns the user to the product list without saving any changes.
  4.4.10. User Interaction Flow (Simplified, High-Level):

1. The administrator navigates to "Add New Product" or selects a product to "Edit."
2. The administrator selects the Product Type. The form dynamically adjusts to
   show/hide relevant sections based on this choice.
3. The administrator fills in the required fields on the "General" tab.
4. The administrator uploads and manages images on the "Images" tab.
5. The administrator sets values for any relevant custom attributes on the "Attributes"
   tab.
6. If the Product Type is 'PARENT', the administrator defines variants on the "Variants"
   tab.
7. If the Product Type is 'REGULAR' or 'VARIANT', the administrator configures pricing on
   the "Pricing" tab.
8. If the Product Type is 'KIT', the administrator configures components on the "Kit
   Components" tab.
9. The administrator adds/edits/deletes FAQs on the "FAQs" tab.
10. The administrator clicks "Save."
11. The system performs extensive validation (see details below).
12. If validation is successful, the product (and any related data - variants, kit components,
    pricing rules, etc.) is saved to the database.
13. If validation fails, error messages are displayed next to the invalid fields, and the form
    remains open for correction.
    4.4.11. Validation (Comprehensive):
     Required Fields: All fields marked as "Required" in the table above must have a value.
     Data Types: Data entered into each field must match the expected data type (e.g.,
    numeric fields must contain numbers, date fields must contain valid dates).
     Uniqueness:
    o SKU must be unique across all products (Regular, Variants, Kits).
    o url_slug must be unique across all active products.
     Variant Attribute Values: For variants, the selected values for variant-defining
    attributes must be valid options for those attributes.
     Pricing Rules:
    o For tiered/volume/step pricing, the quantity ranges must be valid (no overlaps,
    no gaps).
    o Prices and discounts must be valid numbers.
     Kit Components:
    o Base components must be valid products.
    o Swappable components must be variants of a selected parent product.
    o Price adjustments for swappable components must be valid numbers.
     Image Uploads: Check file types and file sizes.
    Database Interaction:
    Saving a product involves creating/updating records in multiple tables:
     Products: The main product record.
     Product_Images: Image data.
     Product_Attribute_Values: Values for custom attributes.
     Product_Variant_Attributes: Values for variant attributes (for variants only).
     Product_Pricing: Pricing rules.
     Kits and Kit_Components: For kit products.
     Product_FAQs: Product-specific FAQs.
    4.4.12. "Product Detail Page (PDP) - Frontend (Customer View)"
     Page Purpose: The Product Detail Page (PDP) is the primary page where customers
    view detailed information about a specific product, make selections (variants,
    quantity), and add the product to their shopping cart. It's the core page for driving
    conversions.
     Page URL Structure: The PDP typically uses a URL structure that includes the product's
    unique identifier, usually the url_slug:
    /products/ {url_slug}
    Example: /products/red-cotton-t-shirt
     Key Elements and Functionality (Customer Perspective):
    o Product Title: The product name (from product_name in the Products table).
    Prominently displayed.
    o Product Summary: A concise description.
    o Product Images:
     Main Image: The is_primary image from the Product_Images table (or
    the primary image of the selected variant).
     Image Gallery: Displays all associated images for the product (and
    potentially variant-specific images). Should include:
     Thumbnails for easy navigation.
     Zoom functionality (on hover or click).
     Ability to cycle through images (carousel or similar).
     Support for video (future enhancement).
     Image Alt Text: This should be read by screen readers.
    o Price Display:
     Displays the calculated price for the selected variant and quantity.
     Clearly indicates if the price is inclusive or exclusive of taxes (based on
    the tax_inclusive flag on the category and global settings).
     If there are price adjustments (tiered, volume, step pricing, discounts,
    customer group/channel-specific pricing), the displayed price should
    reflect these. The original price might be shown with a strikethrough to
    indicate a discount.
    o Variant Selectors (if applicable):
     If the product is a PARENT product, the PDP must include selectors
    (usually dropdowns) for each variant-defining attribute.
     Example: If a T-shirt has variants based on "Color" and "Size," there will
    be a dropdown for "Color" and a dropdown for "Size."
     Dynamic Updates: When the customer selects a variant:
     The displayed price must update to reflect the variant's price.
     The main image should update to show the variant-specific
    image (if available).
     The available stock quantity (inventory) should update.
     The product's URL should be updated in order to let users save
    variant specific URLs.
     Any variant-specific descriptions or attributes should be
    updated.
     Out-of-Stock Variants: Variants that are out of stock (based on
    inventory) should be clearly indicated (e.g., grayed out, with an "Out of
    Stock" message). The system might allow backorders (if configured) or
    have a "Notify Me" option (future enhancement).
    o Quantity Selector:
     Allows the customer to choose the quantity they want to purchase.
     Should be a numeric input field with increment/decrement buttons (or
    a similar UI).
     The quantity selection must be considered in the price calculation (for
    tiered/volume/step pricing).
     Should respect maximum order quantities (if configured).
    o "Add to Cart" Button:
     A prominent button that adds the selected product (and variant, if
    applicable) and quantity to the customer's shopping cart.
     After clicking, the page might:
     Redirect to the cart page.
     Display a mini-cart summary.
     Show a success message ("Added to Cart") and remain on the
    PDP.
    o "Add to Wishlist" Button:
     Lets the customer add the product to their wishlist.
     Should have a visual indicator if the item is added to the wishlist.
    o Product Description:
     Displays the full product description (from product_description in the
    Products table).
     Supports rich text formatting (HTML).
    o Product Specifications (Attributes):
     Displays a list of product attributes and their values (those marked as
    "Display on PDP" in the attribute definition).
     Might be organized into groups (e.g., "Technical Specifications,"
    "Dimensions," "Materials").
     This section is not used for variant selection (that's handled by the
    Variant Selectors).
     Inventory Status:
    o Clearly indicates the product's availability:
     "In Stock" (with the available quantity, if desired).
     "Out of Stock"
     "Low Stock" (with a customizable threshold).
     "Pre-Order" (if the product status allows pre-orders).
     "Backorder" (if backorders are enabled).
     Product Reviews:
    o Displays approved customer reviews for the product.
    o Includes the review title, rating (stars), review text, reviewer name (or
    "Anonymous"), and date.
    o May include "Helpful/Not Helpful" voting buttons.
    o Includes a "Write a Review" button/link (for logged-in customers).
     Product FAQs:
    o Displays a list of frequently asked questions and answers (both productspecific and global FAQs).
    o May be presented in an accordion or similar expandable/collapsible format.
     Shipping Information: (Often a separate section or tab)
    o Provides information about shipping costs, methods, and estimated delivery
    times. This might be dynamically calculated based on the customer's location
    (future enhancement).
     Related Products: (Future Enhancement)
    o Displays a list of related products (e.g., "Customers who bought this also
    bought..."). This can be based on various algorithms (cross-selling, up-selling).
     Social Sharing Buttons: (Future Enhancement)
    o Allows customers to share the product on social media platforms.
     Kit Configuration (if applicable):
    o If the product is a KIT product:
     Base Components: List the included base components (with their
    names and quantities).
     Swappable Components: For each swappable component group:
     Display the name of the component group (e.g., "Graphics
    Card").
     Provide selectors (usually dropdowns) for each available option
    (the variants of the parent product associated with that
    swappable component).
     Dynamically update the kit price as the customer makes
    selections (if the kit uses dynamic pricing). Clearly show any
    price adjustments associated with each option.
     Business Logic:
    o The PDP retrieves product data based on the url_slug in the URL.
    o It handles variant selection, price calculation, and inventory status
    dynamically.
    o It interacts with the shopping cart system when the "Add to Cart" button is
    clicked.
    o It displays relevant information based on the product type (Regular, Parent,
    Variant, Kit).
    o The PDP displays products that are marked as active and have the status that
    are marked as orderable.
14. Inventory Management
    5.1.Module Overview
    This module is responsible for tracking and managing the stock levels of all products across
    all defined fulfillment locations within the e-commerce system. It provides the tools to
    accurately reflect the quantity of products available for sale, handle stock movements
    (receiving, shipping, adjustments), and provide visibility into inventory status. This module
    is critical for preventing overselling, informing purchasing decisions, and ensuring
    accurate order fulfillment. It also supports advanced features like serialized inventory and
    lot/batch tracking for businesses with those requirements.
    5.1.1. List of Features:
     Inventory Tracking by Location:
    o Maintain separate inventory counts for each product at each defined
    fulfillment location (e.g., warehouses, retail stores, drop-shipping centers).
     Multiple Inventory States:
    o Track not just the total quantity on hand, but also different states of inventory,
    including:
     stock_quantity: The total quantity physically present at the location.
     reserved_quantity: The quantity currently reserved for pending orders
    (placed but not yet shipped). This prevents overselling.
     non_saleable_quantity: The quantity that is damaged, defective, or
    otherwise not available for sale. This is separated to maintain accurate
    "available to promise" counts.
     on_order_quantity: The quantity of the product that has been ordered
    from suppliers (via purchase orders) but has not yet been received. This
    helps with forecasting.
     in_transit_quantity: Quantity that has left the supplier and is on way.
     returned_quantity: The quantity of the product that has been returned
    by customers but has not yet been processed (inspected and either
    returned to stock or marked as non-saleable).
     hold_quantity: The quantity of the product that is temporarily
    unavailable for any reason (e.g., quality control hold, special
    promotions).
     backorder_quantity: The quantity of the product that customers have
    ordered beyond the available stock (if backorders are enabled).
     Automatic Inventory Adjustments:
    o The system automatically adjusts inventory levels based on order processing
    events:
     Order Placement: When an order is placed (moves to a PENDING state),
    inventory is reserved.
     Order Shipment: When an order is shipped, the reserved inventory is
    decremented from the stock_quantity.
     Order Cancellation (before shipment): Reserved inventory is released
    back to stock_quantity.
     Manual Inventory Adjustments:
    o Administrators can manually adjust inventory levels to account for:
     Cycle counts (reconciling physical inventory with system records).
     Damage or loss.
     Receiving stock without a purchase order.
     Transfers between locations.
    o All adjustments require a reason to be selected (from a predefined list) and are
    recorded in an audit trail.
     Low Stock Notifications:
    o The system can send notifications (e.g., emails) to administrators when the
    available quantity of a product at a location falls below a defined threshold.
     Serialized Inventory Tracking:
    o For products marked as "serialized," the system tracks individual, unique units
    of inventory, each identified by a serial number. This is essential for
    electronics, appliances, and other high-value items.
     Lot/Batch Tracking:
    o For products marked as "lotted," the system tracks inventory in batches or lots,
    which are groups of items with shared characteristics (e.g., expiration date,
    manufacturing date). This is common in the food, pharmaceutical, and
    chemical industries.
     Inventory Transfers:
    o Allows administrators to record the movement of inventory between different
    fulfillment locations.
     Inventory History (Audit Trail):
    o Maintains a complete, immutable record of every inventory adjustment,
    including the date, time, user, reason, and quantity change. This is essential for
    auditing and troubleshooting.
     Optional Module Enable/Disable:
    o The entire inventory management module can be enabled or disabled via
    global system settings. This is useful for businesses that don't require inventory
    tracking.
     Import or Export inventory information.
    5.1.2. Tenant Admin Configurable Features:
     Global Enable/Disable: Turn the entire inventory management module on or off.
     Fulfillment Locations: Define, edit, and delete fulfillment locations (name, address,
    type).
     Low Stock Thresholds: Set default and product/location-specific low-stock notification
    thresholds.
     Adjustment Reasons: Define the list of reasons available for manual inventory
    adjustments (e.g., "Cycle Count," "Damage," "Loss," "Received - No PO").
     SKU Auto Generation: Define the format for SKU auto generation.
    5.2.Fulfilment Locations
    5.2.1. Pages: Add/Edit/List Fulfilment Locations:
    Page Purpose:
     Add: Create new fulfillment locations in the system (e.g., warehouses, retail stores).
     Edit: Update the information of existing fulfillment locations.
     List: Display a list of all defined fulfillment locations, allowing administrators to
    manage them.
    Page Structure and Elements:
    Field Type Required Validation Description
    Location
    Name
    Text
    Input
    Yes Unique, Max Length: 255 The name of the fulfillment
    location (e.g., "Main
    Warehouse", "Downtown
    Store"). This name is used
    throughout the admin
    panel and potentially in
    customer-facing
    communications.
    Location Type
    Dropdown
    Yes Must be one of:
    'WAREHOUSE', 'STORE',
    'FULFILLMENT_CENTER'
    Categorizes the type of
    location. This may influence
    business logic (e.g.,
    different shipping options
    might be available from
    different location types).
    Address Line 1 Text
    Input
    No Max Length: 255 The first line of the
    location's address.
    Address Line 2 Text
    Input
    No Max Length: 255 The second line of the
    location's address
    (optional).
    City Text
    Input
    No Max Length: 255 The city of the location.
    State/Province Text
    Input
    No Max Length: 255 The state or province of the
    location.
    Postal Code Text
    Input
    No Max Length: 255 The postal code (ZIP code)
    of the location.
    Country Code
    Dropdown
    No Must be a valid ISO 3166-
    1 alpha-2 country code
    The country of the location.
    Select from a list of
    countries.
    Is Active Checkbox Yes Default: Checked Determines whether the
    location is active and
    available for use.
    Deactivated locations will
    not be used for inventory
    calculations or order
    fulfillment.
    Save Button N/A N/A Submits the form to create
    or update the fulfillment
    location.
    Cancel Button N/A N/A Returns to the list of
    fulfillment locations
    without saving.
    User Interaction Flow (Add/Edit):
15. The administrator navigates to the "Fulfillment Locations" section of the admin panel.
16. To add a new location, they click an "Add New Location" button. To edit an existing
    location, they click an "Edit" button next to the location in the list.
17. The "Add/Edit Fulfillment Location" form is displayed.
18. The administrator fills in the fields (Location Name, Type, Address, etc.).
19. They click "Save."
20. The system validates the input:
     The Location Name must be unique.
     The Location Type must be one of the allowed values.
     The Country Code must be a valid ISO code.
21. If validation is successful, the fulfillment location is created/updated in the database
    (Fulfillment_Locations table), and the administrator is redirected back to the list of
    locations.
22. If validation fails, error messages are displayed, and the form remains open for
    correction.
    User Interaction Flow (List):
23. The administrator navigates to the fulfillment locations listing page.
24. All locations are displayed.
25. The Admin can add, edit or delete locations.
    5.3.Inventory Tracking and Adjustments
    5.3.1. Viewing Inventory (by Product/Location)
    Business Logic:
     Data Retrieval: The system retrieves inventory data from the Inventory table, filtering
    by product_id and location_id to get the relevant records.
     Serialized Products: For products marked as is_serialized = TRUE, the system also
    queries the Serialized_Inventory table to count the number of AVAILABLE units. This
    count represents the true "available to promise" quantity.
     Lotted Products: For products marked as is_lotted = TRUE, the system also queries
    the Lots table to retrieve information about available lots and their quantities. This
    information might be displayed on a detail view.
     Available to Promise (ATP) Calculation: ATP = stock_quantity - reserved_quantity This
    is the core calculation that determines how many units are available for new orders.
    Pages:
    "Inventory List" Page:
    Purpose: Provides a high-level overview of inventory levels across all products and locations.
    This is the main inventory management dashboard.
    Structure:
     Table/Grid: Displays inventory data in a tabular format.
    o Columns:
     Product SKU: The SKU of the product (link to product details).
     Product Name: The name of the product (link to product details).
     Location Name: The name of the fulfillment location.
     stock_quantity: The total quantity on hand.
     reserved_quantity: The quantity reserved for orders.
     non_saleable_quantity: The quantity not available for sale.
     on_order_quantity: The quantity on order from suppliers.
     in_transit_quantity: Shipped from supplier, not received.
     returned_quantity: Returned from customers.
     hold_quantity: Quantity put on hold.
     backorder_quantity: If backorders are allowed.
     low_stock_threshold: The configured low stock threshold.
     ATP (Available to Promise): Calculated as stock_quantity -
    reserved_quantity.
     Actions: Buttons for "View Details" (links to "Inventory Details" page)
    and "Adjust" (links to "Adjust Inventory" page).
     Filters:
    o Product Search: Allows searching by product SKU or name.
    o Category: Filters by product category.
    o Division: Filter by product division.
    o Location: Dropdown to select a specific fulfillment location.
    o Low Stock: Checkbox to show only items that are at or below their low stock
    threshold.
    o Product Status: Filters by different product statuses.
    o Stock Status: Filter by different stock statuses (In Stock, Out of Stock, Low Stock
    etc).
     Sorting: Allows sorting by any column (e.g., sort by SKU, Product Name, Location, ATP,
    etc.).
     Pagination: Handles large datasets by splitting the results into multiple pages.
     Export to CSV: Functionality to let users download the data in CSV.
    "Inventory Details" Page:
    Purpose: Provides detailed information about the inventory of a single product at a single
    fulfillment location. This page shows the history of all inventory adjustments for that
    product/location combination.
    Structure:
     Product Information (Read-only):
    o Product Name
    o SKU
    o Category
    o Division
    o Image (thumbnail)
     Location Information (Read-only):
    o Location Name
    o Location Type
     Inventory Summary:
    o stock_quantity
    o reserved_quantity
    o non_saleable_quantity
    o on_order_quantity
    o in_transit_quantity
    o returned_quantity
    o hold_quantity
    o backorder_quantity
    o low_stock_threshold
    o ATP (Available to Promise - calculated)
    o Last Updated
     Inventory Adjustment History:
    o Table/Grid: Displays a chronological list of all inventory adjustments for the
    product/location.
     Columns:
     Date: Date and time of the adjustment.
     User: The user who made the adjustment.
     Adjustment Type: The type of adjustment (e.g., "ADDITION,"
    "SUBTRACTION," "RESERVATION").
     Quantity Change: The amount of the adjustment (positive or
    negative).
     Reason: The reason for the adjustment.
     New stock_quantity: Value of stock post adjustment.
     Sorting: Newest adjustments are shown first (descending order by
    date/time).
     Serialized Inventory/Lots (Conditional Display):
    o If the product is_serialized = TRUE: Display a section showing a list of available
    serial numbers (from the Serialized_Inventory table) for that location. This
    section might include columns like serial_number, status (AVAILABLE,
    RESERVED, SOLD, etc.), received_date, and potentially a link to the order if the
    serial number is associated with one.
    o If the product is_lotted = TRUE: Display a section showing a list of available lots
    (from the Lots table) for that location. This section might include columns like
    lot_number, expiry_date (if applicable), received_date, and quantity.
     Buttons:
    o "Adjust Inventory" (links to the "Adjust Inventory" page, pre-populated with
    the product and location).
    5.3.2. Manual Adjustments (with Reasons and Audit Trail)
    Business Logic:
     Purpose: Allows authorized users to manually correct inventory discrepancies, record
    losses, or account for situations not automatically handled by the system.
     Audit Trail: Every manual adjustment must create a record in the
    Inventory_Adjustments table. This provides a complete, auditable history of all
    changes to inventory levels.
     Required Reason: A reason must be selected for each adjustment. This helps to
    categorize and understand the reasons for adjustments.
     Impact on Quantities: The adjustment_type determines which inventory quantity field
    (in the Inventory table) is affected:
    o ADDITION: Increases stock_quantity.
    o SUBTRACTION: Decreases stock_quantity.
    o RESERVATION: Increases reserved_quantity.
    o RELEASE_RESERVATION: Decreases reserved_quantity.
    o NON_SALEABLE: Decreases stock_quantity and increases
    non_saleable_quantity.
    o RECEIVE_ORDER: Increases stock_quantity and decreases on_order_quantity.
    o SHIP_ORDER: Decreases stock_quantity. (This is usually handled automatically
    during order fulfillment, but manual adjustment might be needed in some
    cases).
    o RETURN_TO_STOCK: Increases stock_quantity and decreases
    returned_quantity.
    o HOLD: Decreases stock_quantity and increases hold_quantity.
    o RELEASE_HOLD: Increases stock_quantity and decreases hold_quantity.
    o BACKORDER_FULFILLMENT: Decreases backorder_quantity and decreases
    stock_quantity.
    Pages:
    "Adjust Inventory" Page:
    Page Purpose: Allows administrators to manually adjust the inventory level of a specific
    product at a specific location.
    Page Structure and Elements:
    Form Title: "Adjust Inventory"
    Fields:
     Product: (Searchable dropdown/product picker, Required) - Allows the administrator
    to select the product being adjusted. This should be a dynamic search that helps the
    user find the correct product quickly.
     Location: (Dropdown, Required, populated from Fulfillment_Locations) - Selects the
    location.
     Adjustment Type: (Dropdown, Required, options from the adjustment_type ENUM in
    Inventory_Adjustments: ADDITION, SUBTRACTION, RESERVATION,
    RELEASE_RESERVATION, NON_SALEABLE, RECEIVE_ORDER, SHIP_ORDER,
    RETURN_TO_STOCK, HOLD, RELEASE_HOLD)
     Quantity: (Numeric Input, Required) - The amount of the adjustment (positive or
    negative).
     Reason: (Textarea, Required) - A brief explanation of the adjustment.
     Current Quantities: (Read-only fields) - These fields display the current values of the
    relevant quantity fields (stock_quantity, reserved_quantity, etc.) from the Inventory
    table for the selected product and location. This provides context for the adjustment.
     New Quantities: (Read only fields - Calculated) - These fields display the calculated
    values of the quantity.
     Buttons:
    o Save: Saves the adjustment.
    o Cancel: Returns to the previous page without saving.
    User Interaction Flow:
26. The administrator navigates to the "Adjust Inventory" page (either from the general
    Inventory Management section or from the "Inventory Details" page for a specific
    product/location).
27. The administrator selects the product (using the searchable product picker) and the
    location.
28. The administrator selects the `adjustment_type` from the dropdown. The UI might
    dynamically adjust based on the selected type (e.g., showing/hiding certain fields).
29. The administrator enters the `adjustment_quantity` (positive or negative).
30. The administrator selects a reason for the adjustment from the `adjustment_reason`
    dropdown (or enters a custom reason if "Other" is selected).
31. The current quantities are shown for reference.
32. The administrator clicks "Save."
33. The system validates the input.
34. If validation is successful:
     A new record is created in the `Inventory_Adjustments` table, capturing all the
    relevant information (including the `adjustment_user_id` of the logged-in
    administrator).
     The appropriate quantity fields in the `Inventory` table are updated based on the
    `adjustment_type` and `adjustment_quantity`.
     The user is redirected (e.g., back to the "Inventory Details" page) with a success
    message.
35. If validation fails, error messages are displayed.Field Explanations:
    5.3.3. Receiving Stock (from Purchase Orders - Simplified)
    This process occurs when a shipment arrives from a supplier, fulfilling a previously created
    Purchase Order (PO). Crucially, this assumes a separate "Purchase Orders" module exists
    (which is a very common feature in e-commerce platforms, but we haven't explicitly defined
    it in this FSD). We are describing the inventory impact of receiving.
    Business Logic and Steps:
36. Trigger: A user (likely in a warehouse/receiving role) indicates that a shipment related
    to a specific Purchase Order has arrived. This could be through a dedicated "Receiving"
    section in the admin panel, or by updating the status of a PO.
37. Product and Location Identification: The system identifies:
     The product_id (or multiple products, as a PO can contain multiple items) being
    received.
     The location_id (the warehouse/store receiving the stock) – This is usually
    specified on the PO or selected during the receiving process.
38. Quantity Received: The user enters the quantity received for each product on the PO.
    This might be:
     The full quantity ordered.
     A partial quantity (if the shipment is incomplete).
     A quantity greater than ordered (if the supplier over-shipped). The system should
    handle this, likely with a warning or requiring a reason.
39. Serialized/Lotted Products:
     Serialized: If the product is_serialized = TRUE, the user must enter the unique serial
    number for each unit received. This creates new records in the
    Serialized_Inventory table, with status = 'AVAILABLE'.
     Lotted: If the product is_lotted = TRUE, the user must enter the lot_number, and
    the system will check against the expiry_date.
40. Inventory Update:
     The system finds the corresponding Inventory record (matching product_id and
    location_id).
     stock_quantity is increased by the quantity received.
     on_order_quantity is decreased by the quantity received (since the items are no
    longer "on order").
41. Inventory Adjustment Record:
     A record is created in Inventory_Adjustments:
    o adjustment_type = 'RECEIVE_ORDER'
    o adjustment_quantity = the quantity received (positive number)
    o adjustment_reason = (Can be automatically set to "PO #[PO Number]" or
    allow manual entry)
    o adjustment_user_id = the ID of the user performing the receiving action.
    o product_id, location_id, inventory_id are set to the relevant values.
42. Lot Record:
     If a product is lotted a new lot record will also be created.
    Example:
     PO #12345 orders 100 units of "Red T-Shirt" (SKU: TSHIRT-RED) to be delivered to
    "Warehouse A."
     The shipment arrives.
     The receiver confirms 100 units received.
     stock_quantity for TSHIRT-RED at Warehouse A is increased by 100.
     on_order_quantity for TSHIRT-RED at Warehouse A is decreased by 100.
     An Inventory_Adjustments record is created with adjustment_type =
    'RECEIVE_ORDER' and adjustment_quantity = 100.
    5.3.4. Handling Returns (to stock, to non-saleable)
    This process handles items returned by customers. Returns can be for various reasons (wrong
    size, damaged, buyer's remorse). The key is to correctly categorize the returned items and
    update inventory accordingly. This assumes an existing "Orders" and "Returns" module (or a
    "Return Merchandise Authorization - RMA" system).
    Business Logic and Steps:
43. Trigger: A customer return is initiated (typically through an RMA process). The system
    knows the product_id, quantity returned, and the order_id (important for linking back
    to the original sale). The system also records a return_reason.
44. Location: The return is usually processed at a specific location (often a central returns
    processing center). The location_id needs to be identified.
45. Initial Inventory Update: The system increases the returned_quantity in the Inventory
    table, based on product_id and location_id.
46. Inspection: The returned item is inspected to determine its condition.
47. Disposition (Two Main Options):
    a) Return to Stock (Resellable):
     If the item is in perfect condition and can be resold, it is returned to the regular
    stock_quantity.
     The system decreases returned_quantity and increases stock_quantity.
     An Inventory_Adjustments record is created:
    o adjustment_type = 'RETURN_TO_STOCK'
    o adjustment_quantity = the quantity returned to stock (positive
    number)
    o adjustment_reason = (e.g., "Customer Return - Resellable")
    b) Non-Saleable (Damaged, Defective):
     If the item is damaged, defective, or otherwise unsellable, it is moved to the
    non_saleable_quantity.
     The system decreases returned_quantity and increases
    non_saleable_quantity.
     An Inventory_Adjustments record is created:
    o adjustment_type = 'NON_SALEABLE'
    o adjustment_quantity = the quantity moved to non-saleable (positive
    number)
    o adjustment_reason = (e.g., "Customer Return - Damaged")
    c) Other Dispositions (Less common, but possible):
     Returned to supplier (requires integration with purchasing)
     Disposed of
     Repaired/Refurbished
48. Serialized/Lotted Products:
     Serialized Inventory status is updated.
     Lotted Inventory quantity is updated.
    Example:
     A customer returns 1 "Blue Widget" (SKU: BW-001).
     returned_quantity for BW-001 at the returns location is increased by 1.
     Inspection:
    o Scenario A (Resellable): The widget is in perfect condition.
    returned_quantity is decreased by 1, and stock_quantity is increased by 1.
    An adjustment record with adjustment_type = 'RETURN_TO_STOCK' is
    created.
    o Scenario B (Damaged): The widget is damaged. returned_quantity is
    decreased by 1, and non_saleable_quantity is increased by 1. An
    adjustment record with adjustment_type = 'NON_SALEABLE' is created.
    5.3.5. Managing Holds
    This allows administrators to temporarily make a portion of the inventory unavailable for sale
    without actually removing it from the stock_quantity. This could be for various reasons:
     Quality control checks.
     Reserved for a specific promotion or event.
     Pending investigation of a potential issue.
    Business Logic and Steps:
49. Trigger: An administrator initiates a "hold" on a specific quantity of a product at a
    specific location.
50. Quantity and Reason: The administrator specifies:
     product_id
     location_id
     quantity to hold
     reason for the hold (from a predefined list or free-text entry)
51. Inventory Update:
     The system finds the corresponding Inventory record.
     stock_quantity is decreased by the hold quantity.
     hold_quantity is increased by the hold quantity.
52. Inventory Adjustment Record:
     An Inventory_Adjustments record is created:
    o adjustment_type = 'HOLD'
    o adjustment_quantity = the quantity placed on hold (positive number).
    o adjustment_reason = the reason provided by the administrator.
53. Releasing a Hold:
     Trigger: An administrator initiates the release of a hold.
     The administrator specifies the product_id, location_id and the quantity to release
    from hold.
     Inventory Update:
    o The system finds the corresponding Inventory record.
    o stock_quantity is increased by the released quantity.
    o hold_quantity is decreased by the released quantity.
     Inventory Adjustment Record:
    o An Inventory_Adjustments record is created:
     adjustment_type = 'RELEASE_HOLD'
     adjustment_quantity = the quantity released (positive number).
     adjustment_reason (should be auto-populated and indicate
    release.)
    Example:
     An administrator puts 50 units of "Green Gadget" (SKU: GG-002) at "Warehouse
    B" on hold for a quality control check.
     stock_quantity is decreased by 50, hold_quantity is increased by 50.
     An adjustment record is created with adjustment_type='HOLD'.
     Later, 30 units are cleared and released.
     stock_quantity is increased by 30, hold_quantity is decreased by 30.
     An adjustment record is created with adjustment_type = 'RELEASE_HOLD'.
    5.3.6. Serialized Inventory Management
     Receiving: When receiving serialized products, the system requires the administrator
    to enter the unique `serial_number` for each individual unit received. Each serial
    number creates a separate record in the `Serialized_Inventory` table.
     Order Fulfillment: When fulfilling orders containing serialized products, the system
    requiresthe selection of specific serial numbers. This ensures that the correct physical
    items are tracked. The `status` of the selected serial numbers in `Serialized_Inventory`
    is updated to `SOLD`.
     Returns: Returned serialized items are tracked by their `serial_number`. Their `status`
    in `Serialized_Inventory` is updated (e.g., to `RETURNED`).
     Adjustments: Inventory adjustments for serialized products are typically handled by
    changing the `status` of individual serial numbers (e.g., from `AVAILABLE` to
    `DAMAGED`).
     ATP Calculation: The number of available items is determined by counting records in
    `Serialized_Inventory` with a status of `AVAILABLE`.Pages:
    "Serialized Inventory List" Page: (Optional - for viewing/managing serialized inventory)
     Columns: serial_number, product_id, location_id, status, received_date, order_id (if
    assigned).
     Filtering and sorting options.
    5.3.7. Lot/Batch Tracking
     Receiving: When receiving lot-tracked products, the administrator must enter the
    `lot_number`, `expiry_date` (if applicable), `received_date` and the total `quantity`
    received for that lot. This creates a new record in the `Lots` table.
     Order Fulfilment: The system should use a FIFO (First-In, First-Out) or FEFO (FirstExpired, First-Out) strategy to allocate inventory from lots. The UI should allow the
    administrator to select which lot to fulfill from (or the system can automatically
    choose based on FIFO/FEFO).
     Adjustments: Adjustments are made to the `quantity` field within specific records in
    the `Lots` table.
    Pages: A separate page or a section within "Inventory Details" to manage and track lots.
    (Optional)
    5.4.Low Stock Notifications
     A scheduled process (e.g., a cron job or a background task) runs periodically (e.g., once
    a day).
     For each Inventory record, it calculates: available_quantity = stock_quantity -
    reserved_quantity.
     If available_quantity <= low_stock_threshold (and low_stock_threshold is not NULL),
    a notification is triggered.
     Notification Methods:
    o Email: Send an email to designated administrators.
    o Admin Panel Alert: Display a notification within the admin panel's dashboard
    or notification center.
    o Other Integrations: (Future) Send notifications to other systems (e.g., Slack, a
    purchasing system).
     Notification Content:
    o Product Name, SKU, Location, Available Quantity, Low stock threshold
    5.5.Import/Export
    Import: Allow administrators to import inventory data from a CSV file.
     CSV Format: Columns for product id/sku, location id, stock_quantity,
    reserved_quantity, on_order_quantity, in_transit_quantity, returned_quantity,
    hold_quantity, backorder_quantity, low_stock_threshold. \*
     Validation: Ensure product id/sku, location id exists.
    Export: Allow administrators to export inventory data to a CSV file.
54. Pricing, Tax, and Channel Configuration
    6.1.Module Overview (Scope, Features, Tenant Admin Configurables)
    This module provides the tools to define and manage the pricing and tax rules that apply
    to products within the e-commerce platform. It also allows administrators to define and
    manage the different selling channels through which products are offered. This module is
    critical for ensuring accurate pricing, tax calculations, and compliance with regional tax
    regulations. The module allows flexibility in defining pricing strategies, including support
    for different customer groups and selling channels.
    6.1.1. List of Features:
     Selling Channel Management:
    o Create, edit, and deactivate selling channels (e.g., "Webstore," "Mobile
    App," "Amazon Marketplace").
     Tax Region Management:
    o Define tax regions (e.g., "Domestic," "EU," "Rest of World").
    o Associate countries (and potentially sub-national regions - future) with tax
    regions.
     Tax Rate Management:
    o Define tax rates, specifying:
     Tax region.
     Product category (optional - can be a default rate for the region).
     Tax type (e.g., "VAT," "Sales Tax," "Cess").
     Tax percentage.
     Price range (optional - for price-dependent tax rates).
     Tax Rate Profile Management:
    o Create and manage tax rate profiles, which group together multiple tax
    rates (of different types).
    o Assign default tax rate profiles to product categories.
     Customer Group Management:
    o Create, Edit, Delete and Manage Customer Groups.
     Product-Level Tax Overrides:
    o Allow overriding the default tax rates for specific products (via Product_Tax
    table).
     Price Calculation Logic:
    o Determine the applicable price based on:
     Product/Variant
     Selected Quantity
     Customer's Group (if customer group specific pricing enabled)
     Selling Channel
     Pricing Rules (Standard, Tiered, Volume, Step)
     Tax Calculation Logic:
    o Determine the applicable tax rate(s) based on:
     Customer's shipping address (tax region).
     Product's category.
     Product's price.
     Any product-level tax overrides.
    o Calculate tax amounts for each applicable tax type.
     Currency Management
    o Define currencies and manage exchange rates
    6.1.2. Tenant Admin Configurable Features:
     Creation, modification, and deactivation of selling channels.
     Definition of tax regions and their associated countries.
     Creation and management of tax rates (including percentages, types, and
    applicable regions/categories).
     Creation and management of tax rate profiles.
     Assignment of default tax rate profiles to categories.
     Creation, modification, and deactivation of customer groups.
    6.2.Selling Channels
    6.2.1. Pages
    "Add/Edit Selling Channel" Page:
     Page Purpose: Allows administrators to create new selling channels or edit
    existing ones.
     Page Structure and Elements:
    Field Type Required Validation Description
    Channel
    Name
    Text
    Input
    Yes Unique, Max
    Length: 255
    The name of the selling channel (e.g.,
    "Webstore", "Mobile App").
    Channel
    Code
    Text
    Input
    No Unique, Max
    Length: 20
    A short code for the channel (e.g., "WEB",
    "APP"). Useful for APIs and internal
    systems.
    Is Active
    Checkbox
    Yes Default:
    Checked
    Determines whether the channel is active
    and available for use.
    Save Button N/A N/A Submits the form to create or update the
    selling channel.
    Cancel Button N/A N/A Returns to the list of selling channels
    without saving.
    User Interaction Flow:
55. The administrator navigates to the "Selling Channels" section of the admin panel.
56. They click "Add New Channel" or click "Edit" on an existing channel.
57. They fill in the Channel Name (required) and optionally the Channel Code.
58. They set the Is Active status.
59. They click "Save."
60. The system validates the input (uniqueness of name and code).
61. If validation is successful, the channel is created/updated in the Selling_Channels
    table.
62. If validation fails, error messages are displayed.
    List Selling Channels Page:
    List out all selling channels with options to add, edit or delete.
    6.3.Tax Region and Rate Management
    6.3.1. Defining Tax Regions, Countries, Rates, and Profiles:
     Tax Regions: Represent geographical areas with common tax rules. A region can
    contain multiple countries (and, in the future, potentially sub-national regions like
    states/provinces).
     Tax Region Countries: Links tax regions to specific countries (using ISO 3166-1
    alpha-2 country codes).
     Tax Rates: Define specific tax rates, including:
    o The region_id they apply to.
    o The category_id they apply to (can be NULL for a region-wide default rate).
    o The tax_type (e.g., "VAT," "Sales Tax," "GST," "Cess").
    o The tax_percentage.
    o Optional price_from and price_to fields for price-dependent taxes.
     Tax Rate Profiles: Group together multiple Tax_Rates (of different tax_type values)
    into reusable profiles. This simplifies assigning default tax rates to categories.
     Priority: Product-specific tax overrides (Product_Tax table) take precedence over
    category defaults, which in turn take precedence over region-wide defaults.
    6.3.2. Pages
    "Add/Edit Tax Region" Page:
     Page Purpose: Allows administrators to create new tax regions or edit existing
    ones.
     Page Structure and Elements:
    Field Type Required Validation Description
    Region
    Name
    Text Input Yes Unique, Max
    Length: 255
    The name of the tax region (e.g.,
    "Domestic," "EU," "North America").
    Region
    Code
    Text Input No Unique, Max
    Length: 255
    A short code for the region (e.g.,
    "DOM," "EU," "NA").
    Is Active Checkbox Yes Default:
    Checked
    Determines whether the tax region is
    active.
    Countries MultiSelect
    Yes A list of countries to associate with this
    region. Uses ISO 3166-1 alpha-2
    country codes.
    Save Button N/A N/A Submits the form to create or update
    the tax region.
    Cancel Button N/A N/A Returns to the list of tax regions
    without saving.
    List Tax Regions Page:
    List out all tax regions with options to add, edit or delete.
    "Add/Edit Tax Rate" Page:
     Page Purpose: Allows administrators to define individual tax rates.
     Page Structure and Elements:
    Field Type Required Validation Description
    Region Dropdown Yes Must be a
    valid
    region_id
    Selects the tax region this rate applies to.
    Options are populated from the
    Tax_Regions table.
    Tax Type Text Input Yes Max
    Length:
    255
    The type of tax (e.g., "VAT," "Sales Tax,"
    "GST," "Cess").
    Tax
    Percentage
    Numeric
    Input
    Yes Decimal
    (e.g., 5.00)
    The tax rate, expressed as a percentage.
    Tax Code Text Input Yes Max
    Length:
    255
    Code for the tax.
    Price From Numeric
    Input
    No Decimal
    (e.g.,
    100.00)
    The minimum product price for this tax
    rate to apply (optional).
    Price To Numeric
    Input
    No Decimal
    (e.g.,
    200.00)
    The maximum product price for this tax
    rate to apply (optional).
    Is Active Checkbox Yes Default:
    Checked
    Determines whether the tax rate is active.
    Save Button N/A N/A Submits the form to create or update the
    tax rate.
    Cancel Button N/A N/A Returns to the list of tax rates without
    saving.
    List Tax Rates Page:
    List out all tax rates with options to add, edit or delete.
    "Add/Edit Tax Rate Profile" Page
     Page Purpose: Allows administrators to create and manage tax rate profiles. Tax
    Rate Profiles are designed to group together multiple individual Tax_Rates into a
    single, reusable unit. This grouping simplifies the process of assigning tax rules to
    categories and, by extension, to products. Instead of manually assigning multiple
    individual tax rates to each category, you assign a profile, and all the rates within
    that profile are automatically applied.
     Page Structure and Elements:
    Field Type Required Validation Description
    Profile
    Name
    Text Input Yes Unique,
    Max
    Length: 255
    The name of the tax rate profile (e.g.,
    "Standard", "EU VAT").
    Tax Rates Multiple
    Selection
    Yes List of applicable tax rates.
    Save Button N/A N/A Submits the form to create or update
    the tax rate profile.
    Cancel Button N/A N/A Returns to the list of tax rate profiles
    without saving.
    List Tax Rate Profiles Page:
    List out all tax rate profiles with options to add, edit or delete.
    How it works during checkout?
     Product Override Check:
    o Look for entries in the Product_Tax table matching the product_id.
    o If found, use only those tax_rate_id values to get corresponding tax rates
    (from Tax_Rates table) and calculate taxes. Done.
     Category Default Profile (if no override):
    o If no product overrides exist:
     Get the category_id from the Products table.
     Get the required default_tax_rate_profile_id from the
    Product_Categories table.
     Use the Tax_Rate_Profiles_Mapping table to get the associated
    tax_rate_id values for that profile.
     Get the tax rates from Tax_Rates using tax_rate_id.
     Region-Wide Defaults (Fallback):
    o If (and only if) no product overrides and no category profile is found (which
    shouldn't happen with the mandatory profile assignment):
     Query Tax_Rates for entries where region_id matches the
    customer's region and category_id is NULL.
     Calculate Taxes: For each applicable tax rate (obtained from Step 1, 2 or 3),
    retrieve tax_percentage, tax_type, price_from, and price_to from Tax_Rates,
    apply price range logic if needed, and calculate the tax amount.
    6.4.Customer Groups
    6.4.1. Pages:
    Add/Edit Customer Group Page:
     Page Purpose: Allows administrators to create new customer groups or edit
    existing ones.
     Page Structure and Elements:
    Field Type Required Validation Description
    Group
    Name
    Text Input Yes Unique, Max
    Length: 255
    The name of the customer group (e.g.,
    "Wholesale", "VIP").
    Is Active Checkbox Yes Default:
    Checked
    Determines if the customer group is
    active
    Save Button N/A N/A Submits the form to create or update
    the customer group.
    Cancel Button N/A N/A Returns to the list of customer groups
    without saving.
    List Customer Groups Page:
     List out all customer groups with options to add, edit or delete.
     The customer groups can be created/edited/deleted which can be later associated
    with customers and pricing rules.
63. Collection Management
    7.1.Module Overview
    This module allows administrators to create and manage collections of products. A
    collection is a curated group of products, presented together to customers for
    promotional, thematic, or organizational purposes. Collections are not purchasable units
    themselves; customers purchase the individual products within a collection. Collections
    are primarily a merchandising and presentation tool. Examples include: "New Arrivals,"
    "Summer Sale," "Gifts for Him," "Back to School Essentials."
    7.1.1. List of Features:
     Create new collections.
     Edit existing collections (name, description, active status).
     Delete collections.
     Add products to a collection.
     Remove products from a collection.
     Control the display order of products within a collection.
     Set an active/inactive status for collections.
     Add a name, description and images to the collection.
     Import/Export
    7.1.2. Tenant Admin Configurable Features:
     Full control over the creation, modification, and deletion of collections.
     Full control over which products are included in each collection.
    7.2.Collection Creation and Management
    7.2.1. Business Logic and Processes:
     Collection Definition: A collection is defined by:
    o A unique collection_name.
    o An optional collection_description (for internal use or display on a
    collection landing page).
    o An is_active status (active collections are displayed on the storefront;
    inactive collections are hidden).
    o A set of associated products (linked through the Collection_Products
    table).
    o Images associated to the collection.
     Many-to-Many Relationship: The relationship between collections and products
    is many-to-many:
    o A collection can contain many products.
    o A product can belong to many collections.
    o This relationship is managed through the Collection_Products linking table.
     Display Order: The order in which products are displayed within a collection can
    be controlled by the administrator (using the display_order field in the
    Collection_Products table).
     No Inventory or Pricing: Collections do not have their own inventory or pricing.
    Inventory and pricing are managed at the individual product/variant level.
     Active Status: Only active collections are displayed.
     Deletion: Deleting a collection does not delete the products within the collection;
    it simply removes the associations in the Collection_Products table.
    7.2.2. Pages:
    "Add/Edit Collection" Page:
     Page Purpose: Allows administrators to create new collections or edit existing
    ones.
     Page Structure and Elements:
    Field Type Required Validation Description
    Collection
    Name
    Text Input Yes Unique, Max
    Length: 255
    The name of the collection (e.g.,
    "Summer Sale," "New Arrivals").
    Displayed to customers.
    Collection
    Description
    Textarea No A description of the collection (for
    internal use or display on a
    collection landing page).
    Is Active Checkbox Yes Default:
    Checked
    Determines whether the collection
    is displayed on the storefront.
    Products Product
    Selector
    Yes Must select at
    least one
    product
    A mechanism to add/remove
    products from the collection. See
    options below.
    Product
    Order
    (Varies) No A way to control the display order of
    products within the collection. See
    options below.
    Images (Multi-file
    uploader)
    No A way to upload images for the
    collection. See options below.
    Save Button N/A N/A Submits the form to create or
    update the collection.
    Cancel Button N/A N/A Returns to the list of collections
    without saving.
     Product Selection Options (Choose One):
    Table with Add Button: A table listing the currently selected products. An "Add
    Products" button opens a modal dialog with a searchable product list (similar to
    the two-panel approach).
     Product Ordering Options (Choose One):
    Drag-and-Drop: Allow administrators to drag and drop the selected products into
    the desired order. This is more user-friendly.
     Image Management:
    o Functionality to upload multiple images.
    o For each image: File upload, Alt text, Set as Primary, Sort order, Delete
    button.
     User Interaction Flow:
64. Admin navigates to the "Collections" section of the admin panel.
65. Clicks "Add New Collection" or selects a collection to edit.
66. Fills in the Collection Name (required) and Collection Description (optional).
67. Uses the product selection mechanism to add products to the collection.
68. Sets the display order of products (using the chosen method).
69. Sets the Is Active status.
70. Uploads images.
71. Clicks "Save."
72. The system validates the input (uniqueness of collection name).
73. If validation passes, the collection is created/updated in the Collections table,
    and the product associations are saved in the Collection_Products table
    (including the display_order).
    7.3.Import/Export
     Import: Allow administrators to import collections from a CSV file.
    o CSV Format: Columns for collection name, description, is_active, product
    SKUs (comma-separated or pipe-separated list of SKUs).
    o Validation: Ensure collection names are unique; product SKUs exist.
     Export: Allow administrators to export collection data to a CSV file.
74. Product Reviews
    8.1.Module Overview
    This module enables customers to submit reviews and ratings for products they have
    purchased. It also provides tools for administrators to moderate these reviews, ensuring
    quality and appropriateness. Product reviews are a crucial element for building trust,
    providing social proof, and influencing purchasing decisions.
    8.1.1. List of Features:
     Customer Review Submission:
    o Allow registered, logged-in customers who have purchased a product to
    submit a review.
    o Require a numerical rating (e.g., 1-5 stars).
    o Allow (or require) a review title (short summary).
    o Allow (or require) review text (detailed feedback).
    o Option for customers to submit reviews anonymously.
     Review Display:
    o Display approved reviews on the product detail page.
    o Show the average rating for the product.
    o Show the number of reviews.
    o Sort reviews (e.g., by date, helpfulness).
    o Paginate reviews if there are many.
    o Display customer name (or "Anonymous") and date of review.
    o Display the helpful and non-helpful votes.
     Review Moderation (Admin Panel):
    o Allow administrators to view all submitted reviews.
    o Approve or reject reviews.
    o Edit reviews (e.g., to correct typos or remove inappropriate language –
    with an audit trail).
    o Delete reviews.
     Helpfulness Voting:
    o Allow users (customers or potentially all visitors) to vote on whether a
    review is helpful or not.
    o Prevent users from voting multiple times on the same review.
     Reporting (Future):
    o Provide reports on review statistics (e.g., average rating per product,
    number of reviews per product, reviews over time).
     Optional Enable/Disable: The reviews feature can be enabled or disabled at a
    global level (via a tenant admin setting).
    8.1.2. Tenant Admin Configurable Features:
     Enable/disable the entire reviews module.
     Configure whether reviews require approval before being displayed.
     Configure whether anonymous reviews are allowed.
     Configure whether the review title is required.
     Configure whether the review text is required.
     Configure whether helpfulness vote is enabled.
    8.2.Review Submission (Customer Perspective)
    8.2.1. Business Logic and Processes:
     Eligibility: Only registered, logged-in customers who have purchased the product
    can submit a review. This prevents spam and ensures that reviews are from
    verified buyers. This requires integration with the "Orders" module.
     One Review Per Customer Per Product: A customer can submit only one review
    per product. If they try to submit another, they should be able to edit their existing
    review.
     Approval Process: Reviews may be subject to administrator approval before being
    displayed (configurable).
     Anonymous Option: Customers may have the option to submit reviews
    anonymously (configurable).
     Helpfulness Voting: Users (customers or visitors, depending on configuration) can
    vote on whether a review is helpful or not helpful. A user can only vote once per
    review.
     Form Validation:
    o Check for valid customer and product
    o Validate rating
    o Check for max length of title and description.
    8.2.2. Pages/UI Elements:
    Product Detail Page (Integration Point):
     A "Write a Review" button/link is displayed on the product detail page if the user
    is logged in, has purchased the product, and has not already submitted a review.
    If they have already written a review, show an "Edit your review" link.
     Existing approved reviews are displayed (see "Review Display" below).
     "Write/Edit Review" Form:
    o Page Purpose: Allows a customer to submit or edit their review for a
    product.
    o Page Structure and Elements:
    Field Type Required Validation Description
    Product (Readonly)
    N/A Displays the product name and
    image (for confirmation).
    Rating Star
    Rating
    Yes Must be between
    1 and 5 (inclusive)
    Allows the customer to select a
    star rating.
    Review Title Text Input Admin
    Configurable
    Max Length: 255 A short summary of the review.
    Review Text Textarea Admin
    Configurable
    The main body of the review.
    Anonymous Checkbox No Allows the customer to submit
    the review anonymously (if
    enabled in settings).
    Submit/Save Button N/A N/A Submits the review (or saves
    changes to an existing review).
    Cancel Button N/A N/A Returns to the product detail
    page without saving.
    User Interaction Flow:
75. Customer navigates to the product detail page.
76. If eligible (logged in, purchased the product, no existing review), they click "Write a
    Review."
77. The "Write Review" form is displayed.
78. The customer fills in the rating, title (if required), text (if required), and chooses whether
    to be anonymous (if enabled).
79. They click "Submit."
80. The system validates the input.
81. If validation is successful:
     A new record is created in the Product_Reviews table (or the existing record is
    updated).
     The is_approved status is set based on the admin configuration (either immediately
    TRUE or FALSE pending approval).
     The customer is redirected back to the product detail page with a success message
    (e.g., "Thank you for your review! It will be displayed after approval.").
82. If validation fails, error messages are displayed.
    8.3.Review Display (Customer Perspective)
    8.3.1. Business Logic and Processes:
     Filtering: Only approved reviews (is_approved = TRUE) are displayed.
     Sorting: Reviews are typically sorted by date (newest first), but other sorting options
    (e.g., by helpfulness, rating) may be provided.
     Pagination: If there are many reviews, they are displayed in pages (e.g., 10 reviews per
    page).
     Average Rating: The average rating is calculated from all approved reviews for the
    product.
     Anonymity: If a review is marked as anonymous, the customer's name is not displayed
    (e.g., "Anonymous User").
     Helpfulness Display: The number of "helpful" and "not helpful" votes are displayed for
    each review.
    8.3.2. Pages/UI Elements:
     Product Detail Page (Integration Point):
     A section on the product detail page displays the approved reviews.
     Elements:
     Average Rating: Displays the average star rating (e.g., 4.5 stars).
     Number of Reviews: Displays the total number of approved reviews (e.g., "12
    Reviews").
     Review List: Displays each individual review:
     Customer Name (or "Anonymous")
     Review Date
     Star Rating
     Review Title
     Review Text
     Helpfulness Votes: "Helpful (10)" "Not Helpful (2)" - with buttons/links
    to vote.
     Sorting Options: (Optional) - Dropdown to sort reviews (e.g., "Newest First,"
    "Highest Rated," "Most Helpful").
     Pagination Controls: (If applicable) - "Previous," "Next," page numbers.
    8.4.Review Moderation (Admin Panel)
    8.4.1. Business Logic and Processes:
     Access Control: Only authorized administrators can access the review moderation
    tools.
     Approval/Rejection: Administrators can approve or reject pending reviews.
     Editing: Administrators can edit reviews (e.g., to correct typos, remove inappropriate
    language, or shorten excessively long reviews). Any edits should be tracked in an audit
    log (not explicitly modeled here, but a best practice).
     Deletion: Administrators can delete reviews.
    8.4.2. Pages:
    "Manage Reviews" Page (Admin Panel):
     Page Purpose: Allows administrators to view, approve, reject, edit, and delete product
    reviews.
     Page Structure and Elements:
    Column Description
    Product The name and/or SKU of the product (link to product details).
    Customer The name of the customer who submitted the review (or "Anonymous").
    Rating The star rating.
    Review Title The review title.
    Review Text The review text (may be truncated, with a link to view the full text).
    Date Submitted The date the review was submitted.
    Status The current status of the review ("Pending," "Approved," "Rejected").
    Helpful Votes The number of "helpful" votes.
    Not Helpful Votes The number of "not helpful" votes.
    Actions Buttons for "Approve," "Reject," "Edit," "Delete."
     Filtering and Sorting:
    o Filter by Status: Allow filtering by "Pending," "Approved," "Rejected."
    o Filter by Product: Allow filtering by product name/SKU.
    o Filter by Customer: Allow searching by customer.
    o Sort by Date: Sort by submission date (newest/oldest).
    o Sort by Rating: Sort by rating (highest/lowest).
     "Edit Review" Page (Admin Panel):
    o Page Purpose: Allows administrators to edit an existing review.
    o Page Structure: Similar to the "Write Review" form (customer perspective),
    but pre-populated with the existing review data. Includes an "Approve" and
    "Reject" button.
    o Important: Any edits made by an administrator should be tracked in an audit
    log (not explicitly modeled in this FSD, but a best practice).
    8.5.Helpfulness Voting (Database and Logic)
     Preventing Multiple Votes: This is best handled with a separate table to track votes.
     Table: Review_Votes
    o vote_id (INT, PRIMARY KEY, AUTO_INCREMENT)
    o review_id (INT, NOT NULL, FOREIGN KEY referencing Product_Reviews)
    o user_id (INT, NULL, FOREIGN KEY referencing Users/Customers Table)
    o vote_type (ENUM('HELPFUL', 'NOT_HELPFUL'), NOT NULL)
    o vote_timestamp (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
    o UNIQUE constraint on (review_id, user_id) - This prevents a user from voting
    multiple times on the same review.
     Logic:
83. When a user clicks "Helpful" or "Not Helpful":
84. Check if a record already exists in Review_Votes with the given review_id and
    user_id.
85. If a record exists, do not allow the vote (display a message, perhaps).
86. If a record does not exist, insert a new record into Review_Votes with the
    appropriate vote_type.
87. Update the helpful_votes or not_helpful_votes count in the Product_Reviews
    table (increment the appropriate counter). This is done for performance
    reasons; you could calculate these counts on the fly, but that's less efficient.
88. Global FAQs
    9.1.Module Overview
    This module allows administrators to create, manage, and display a set of Frequently
    Asked Questions (FAQs) that are not tied to specific products. These FAQs provide
    general information about the store, its policies, shipping, returns, payments, and other
    common customer inquiries. The goal is to reduce customer support requests and
    provide self-service information.
    9.1.1. List of Features:
     Create FAQ Categories: Organize FAQs into logical categories (e.g., "Shipping,"
    "Returns," "Payment," "Account").
     Create FAQs: Add individual FAQ entries, consisting of a question and an answer.
     Edit FAQs: Modify the question, answer, or category of existing FAQs.
     Delete FAQs: Remove FAQs that are no longer relevant.
     Order FAQs: Control the display order of FAQs within each category.
     Order Categories: Control the display order of the categories.
     Rich Text Editor: Allow formatting of the answer text (bold, italics, lists, links,
    etc.) for clarity and readability.
     Search (Future): Allow customers to search the FAQs by keyword.
     Display on Frontend: Display the FAQs on a dedicated "FAQ" page on the
    storefront, organized by category.
    9.1.2. Tenant Admin Configurable Features:
     Full control over FAQ categories (creation, editing, deletion, ordering).
     Full control over individual FAQs (creation, editing, deletion, ordering).
     Enable/disable the FAQs section.
    9.2.FAQ Management (Admin Panel)
    9.2.1. Business Logic and Processes:
     Categorization: FAQs are organized into categories to improve navigation and
    findability.
     Ordering: Both categories and FAQs within categories have a display order,
    controlled by the administrator.
     Rich Text Editing: The answer field supports rich text formatting (using a
    WYSIWYG editor) to allow for clear and well-structured answers.
     No Customer Interaction (Beyond Viewing): Customers can only view the FAQs;
    they cannot submit questions or interact with the FAQs in any other way (e.g., no
    voting, commenting). This is a read-only information resource.
    9.2.2. Pages
    "Manage FAQ Categories" Page:
     Page Purpose: Allows administrators to create, edit, delete, and reorder FAQ
    categories.
     Page Structure and Elements:
    Column Description
    Category Name The name of the category (e.g., "Shipping," "Returns").
    Display Order A numeric field (or drag-and-drop interface) to control the order of the
    categories.
    Actions Buttons for "Edit," "Delete," and potentially "View FAQs" (links to filtered
    FAQ list).
    "Add/Edit FAQ Category" Page:
     Page Purpose: Create a new category or edit an existing one.
     Fields:
    o Category Name (Text Input, Required, Unique)
    o Display Order (Numeric Input, Required)
     Buttons: "Save," "Cancel"
    "Manage FAQs" Page:
     Page Purpose: Allows administrators to create, edit, delete, and reorder FAQs.
     Page Structure and Elements:
    Column Description
    Question The FAQ question.
    Category The category the FAQ belongs to.
    Display Order A numeric field (or drag-and-drop interface) to control the order of FAQs within
    the category.
    Actions Buttons for "Edit," "Delete."
     Filtering: Allow filtering by category.
     Sorting:
    o Sort by Category.
    o Sort by display order.
    "Add/Edit FAQ" Page:
     Page Purpose: Create a new FAQ or edit an existing one.
     Fields:
    o Category (Dropdown, Required, populated from FAQ_Categories)
    o Question (Text Input, Required)
    o Answer (Rich Text Editor, Required)
    o Display Order (Numeric Input, Required)
     Buttons: "Save," "Cancel"
    9.3.FAQ Display (Frontend)
    9.4.Business Logic and Processes:
     Dedicated Page: FAQs are displayed on a dedicated "FAQ" page on the storefront
    (e.g., /faq).
     Category Grouping: FAQs are grouped by their assigned category.
     Ordering: Categories and FAQs within categories are displayed in the order
    specified by the administrator.
     Accessibility: The FAQ page should be accessible and easy to navigate.
    9.5.Page structure example
    FAQ Page
    [Category 1 Name]

- Question 1
  Answer 1 (formatted)
- Question 2
  Answer 2 (formatted)
  ...
  [Category 2 Name]
- Question 3
  Answer 3 (formatted)
- Question 4
  Answer 4 (formatted)
  ...
  ... (Other Categories and FAQs)

10. Currency Management
    10.1. Module Overview
    This module allows administrators to define the currencies supported by the ecommerce platform and to manage the exchange rates between these currencies and
    the base currency. This enables customers to view prices and make purchases in their
    preferred currency, while the system maintains consistent internal accounting in the
    base currency.
    10.2. List of Features:
     Currency Definition:
    o Add new currencies.
    o Edit existing currencies (name, symbol, active status).
    o Delete currencies (only if not used in any transactions).
    o Set a currency as active/inactive.
     Exchange Rate Management:
    o Define exchange rates between supported currencies and the base
    currency.
    o Manually enter exchange rates.
    o Store historical exchange rates (for reporting and accounting purposes).
     Display Currency:
    o Select a display currency on the front end.
    10.3. Tenant Admin Configurable Features:
     Add, edit, and deactivate currencies.
     Manually set exchange rates.
     Enable/Disable automatic updates.
    10.4. Currency and Exchange Rate Management
    10.5. Business Logic and Processes:
     Base Currency: The system has a single, pre-defined base currency (configured in the
    global settings). All product prices are stored in the base currency.
     Supported Currencies: Administrators can add multiple currencies, specifying their
    ISO 4217 code (e.g., USD, EUR, GBP), name (e.g., US Dollar, Euro, British Pound), and
    symbol (e.g., $, €, £).
     Exchange Rates: Exchange rates are defined relative to the base currency. For
    example, if the base currency is USD, an exchange rate record for EUR might be:
    from_currency_code = "USD", to_currency_code = "EUR", exchange_rate = 0.85. This
    means 1 USD = 0.85 EUR.
     Manual Updates: Administrators can manually enter exchange rates.
     Automatic Updates (Future): The system could be integrated with an external
    exchange rate API (e.g., Open Exchange Rates, Fixer.io) to automatically update
    exchange rates at a defined interval (e.g., daily). This is a future enhancement.
     Historical Rates: The system stores historical exchange rates (Exchange_Rates table).
    This is important for:
    o Reporting: Generating accurate reports for past transactions.
    o Accounting: Ensuring that transactions are recorded using the correct
    exchange rate at the time of the transaction.
     Active/Inactive Currencies: Administrators can activate or deactivate currencies.
    Inactive currencies are not available for selection on the storefront.
     Display Currency: Customers can select a currency to display the prices.
    10.6. Pages
     Add/Edit Currency Page:
    o Page Purpose: Allows administrators to create new currencies or edit existing ones.
    o Page Structure and Elements:
    Field Type Required Validation Description
    Currency
    Code
    Text
    Input
    Yes Unique, 3 characters
    (ISO 4217)
    The three-letter ISO 4217 currency
    code (e.g., USD, EUR, GBP).
    Currency
    Name
    Text
    Input
    Yes Unique, Max Length:
    255
    The full name of the currency (e.g., US
    Dollar, Euro).
    Symbol Text
    Input
    Yes Max Length: 10 The currency symbol (e.g., $, €, £).
    Is Active
    Checkbox
    Yes Default: Checked Determines whether the currency is
    active and available for use.
    Save Button N/A N/A Submits the form to create or update
    the currency.
    Cancel Button N/A N/A Returns to the list of currencies
    without saving.
     Currency Listing Page
    o Page to list all currencies and perform actions like Add, Edit, Delete.
     "Add/Edit Exchange Rate" Page:
    o Page Purpose: Allows administrators to manually enter or update exchange rates.
    o Page Structure and Elements:
    Field Type Required Validation Description
    From
    Currency
    Dropdown Yes Valid
    currency
    code
    The base currency (this will usually be fixed and
    determined by the global system settings).
    Should display the base currency set in
    configurations.
    To
    Currency
    Dropdown Yes Valid
    currency
    code
    The target currency for which the exchange
    rate is being defined. Options are populated
    from the Currencies table (excluding the base
    currency).
    Exchange
    Rate
    Numeric
    Input
    Yes Positive
    number
    The exchange rate (how much of the target
    currency one unit of the base currency is
    worth).
    Effective
    Date
    (Readonly)
    N/A The date and time the exchange rate became
    effective.
    Save Button N/A N/A Submits the form to create or update the
    exchange rate.
    Cancel Button N/A N/A Returns to the list of exchange rates without
    saving.
     Exchange Rate Listing Page
    o List out all currencies, with the latest exchange rate, with options to edit/add.
     Frontend (Currency Selector)
    o This is usually a dropdown/selector in the header, footer or sidebar of the eCom
    website.
    o This will list all the active currencies for the customers to choose from.
    o Once selected, prices should show in selected currency.
11. Data Import/Export
    11.1. Module Overview
    This module provides the tools to import data into and export data from the e-commerce platform. It
    supports various data formats (primarily CSV) and covers key data entities like products, inventory,
    categories, collections, and (in the future) orders and customers. This functionality is essential for:
     Initial Data Loading: Populating the system with initial product catalogs, inventory data,
    etc.
     Bulk Updates: Making changes to large numbers of records efficiently (e.g., updating
    prices for many products).
     Data Migration: Moving data between different instances of the platform (e.g., from a
    staging environment to production).
     Integration: Exchanging data with other systems (e.g., accounting software, ERP
    systems).
     Data Backup: Creating backups of critical data.
    List of Features:
     Import Data:
    o Import data from CSV files.
    o Support for different data entities (Products, Categories, Inventory, Collections – see
    details below).
    o Data validation during import (e.g., checking for required fields, data type
    mismatches, foreign key constraints).
    o Error handling and reporting (provide clear error messages for invalid data).
    o Option to either create new records or update existing records (based on a unique
    identifier, like SKU or ID).
    o Option to skip/ignore, stop on error.
     Export Data:
    o Export data to CSV files.
    o Support for different data entities (Products, Categories, Inventory, Collections).
    o Option to select specific fields to export.
    o Option to export all records, or filter by a date and category.
     Import/Export of:
    o Products
    o Product Categories
    o Sub Categories
    o Divisions
    o Units Of Measure
    o Inventory
    o Collections
    o Tax Regions
    o Tax Rates
    o Tax Profiles
    o Selling Channels
    o Customer Groups
     Tenant Admin Configurable Features:
    o Initiate imports and exports.
    o Select data entities and fields for import/export.
    o Configure the import update/insert mode.
    11.2. Import/Export Processes
    11.1.1. General Import Process:
12. File Upload: The administrator uploads a CSV file containing the data to be imported.
13. Entity Selection: The administrator selects the type of data being imported (e.g., "Products,"
    "Inventory," "Categories").
14. Field Mapping (Optional, but Recommended):
     If the CSV column headers do not exactly match the database column names, the
    administrator maps the CSV columns to the corresponding database fields. This provides
    flexibility for importing data from different sources.
     The system should provide a UI to visually map columns (e.g., drag-and-drop or
    dropdown selections).
     The system should remember mappings (for future imports with the same file structure).
15. Validation: The system validates the data in the CSV file:
     Required Fields: Checks that all required fields are present.
     Data Types: Checks that data types are correct (e.g., numeric fields contain numbers,
    dates are in the correct format).
     Foreign Keys: Checks that foreign key values (e.g., category_id, uom_code) exist in the
    corresponding tables.
     Unique Constraints: Checks for violations of unique constraints (e.g., duplicate SKUs).
     Data formats: Validate formats like email, URL, etc.
16. Import Mode: The administrator chooses whether to:
     Create Only: Only insert new records. If a record with a matching unique identifier (e.g.,
    SKU for products) already exists, it is skipped (or an error is reported, depending on
    configuration).
     Update Only: Only update existing records. If a record with a matching unique identifier
    is not found, it is skipped (or an error is reported).
     Create and Update: Insert new records and update existing records based on the unique
    identifier. This is the most common and flexible option.
17. Error Handling
     Stop on error.
     Skip/Ignore error rows.
18. Import Execution: The system processes the CSV file, inserting or updating records in the
    database.
19. Import Report: After the import is complete, the system generates a report summarizing the
    results:
     Number of records processed.
     Number of records created.
     Number of records updated.
     Number of records skipped (with reasons).
     List of any errors encountered (with specific row numbers and error messages).
20. Rollback (Optional, Advanced): In case of a major error, it might be desirable to rollback the
    entire import operation, restoring the database to its state before the import. This is a more
    advanced feature.
    11.1.2. General Export Process:
21. Entity Selection: The administrator selects the type of data to export (e.g., "Products,"
    "Inventory," "Categories").
22. Field Selection (Optional): The administrator selects which fields to include in the export. If
    not specified, all fields for the entity are exported.
23. Filter Selection (Optional): The administrator can filter the records.
24. Export Execution: The system queries the database, retrieves the selected data, and
    generates a CSV file.
25. File Download: The administrator downloads the generated CSV file.
    11.1.3. Specific Data Entity Considerations:
     Products:
    o Required Fields: sku, product_name, product_type, category_id, subcategory_id,
    division_id (and others, depending on your configuration).
    o Parent/Variant Relationships: For variant products, the parent_id field must be
    handled correctly. The parent product should be imported before its variants.
    o Images: Importing/exporting image URLs. The actual image files are not typically
    included in the CSV; the CSV contains paths or URLs to the images.
    o Attributes: Importing/exporting product attribute values. This can be handled in a
    few ways:
     Separate Columns: Each attribute has its own column in the CSV (e.g., color,
    size, weight). This works well for a fixed set of attributes.
     Key-Value Pairs: A single column contains attribute key-value pairs (e.g.,
    "color:red,size:large,weight:1.5"). This is more flexible but requires parsing.
     Inventory:
    o Required Fields: product_id (or sku), location_id, stock_quantity.
    o Other inventory quantities (reserved_quantity, on_order_quantity, etc.) can also be
    imported/exported.
     Categories, Subcategories, Divisions:
    o Relatively straightforward, as these are simple hierarchical structures. Ensure that
    parent categories/divisions are imported before their children.
     Collections:
    o The import/export needs to handle the many-to-many relationship between
    collections and products (via the Collection_Products table). This can be done using a
    comma/pipe separated list of product SKUs or product ids.
     Tax Regions, Tax Rates, Tax Profiles, Selling Channels, Customer Groups:
    o Can be exported/imported directly.
    11.1.4. Pages
    "Import Data" Page:
    Page Purpose: Allows administrators to import data from CSV files.
    Page Structure and Elements:
