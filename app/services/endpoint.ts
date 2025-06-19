export const endpoints = {
  LOGIN: "/auth/mobile-login",

  UPLOAD_SINGLE: "/uploadFiles/upload-single-s3",
  //#region select box
  LOAD_BRANCH: "/mobile/branch/load-data-select",
  LOAD_SUPPLIER: "/mobile/supplier/load-data-select",
  LOAD_PART_OF_BRANCH: "/mobile/branch/part-master-select-box",
  LOAD_ITEM_INDUSTRY: "/mobile/item-industry/select-box",
  LOAD_ITEM_GROUP: "/mobile/item-group/select-box",
  LOAD_EQUIPMENT_TYPE: "/mobile/equipment-type/select-box",
  LOAD_PROPERTY_TYPE: "/mobile/property-type/select-box",
  LOAD_MATERIAL_TYPE: "/mobile/material-type/select-box",

  // #region order
  LOAD_ITEM_UNDER_MIN: "/mobile/item/list-under-min",
  LOAD_ITEM_OTHER: "/mobile/item/list-to-order",
  ORDER_CREATE_FOR_ITEM: "/mobile/item/order-create",
  ORDER_UPDATE_FOR_ITEM: "/mobile/item/order-update",
  ORDER_DETAIL: "/mobile/order/detail",
  ORDER_PAGINATION: "/mobile/order/pagination",
  ORDER_SEND_APPROVE: "/mobile/order/send-approve",
  ORDER_CANCEL: "/mobile/order/cancel-order",
  ORDER_REJECT: "/mobile/order/reject-order",
  ORDER_APPROVE: "/mobile/order/approve-order",
  ORDER_FILTER_HEADER: "/mobile/order/filter-header",
  /** CCDC */
  LOAD_PROPERTY_TO_ORDER: "/mobile/property/list-to-order",
  ORDER_CREATE_FOR_PROPERTY: "/mobile/property/order-create",
  /** MMTB */
  LOAD_EQUIPMENT_TO_ORDER: "/mobile/equipment/list-to-order",
  ORDER_CREATE_FOR_EQUIPMENT: "/mobile/equipment/order-create",

  /** VTTH */
  LOAD_MATERIAL_TO_ORDER: "/mobile/material/list-to-order",
  ORDER_CREATE_FOR_MATERIAL: "/mobile/material/order-create",
  //#endregion

  /** received PO */
  DELIVERY_NOTE_PAGINATION: "/mobile/delivery-note/pagination",
  DELIVERY_NOTE_RECEIVED: "/mobile/delivery-note/received",
  DELIVERY_NOTE_RECEIVED_AND_IMPORT:
    "/mobile/delivery-note/received-and-import",
  DELIVERY_NOTE_DETAIL: "/mobile/delivery-note/detail",

  /** Import  */
  INBOUND_PAGINATION: "/mobile/inbound/pagination",
  INBOUND_IMPORT: "/mobile/inbound/import",
  INBOUND_DETAIL: "/mobile/inbound/detail",
};
