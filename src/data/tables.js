const tables = {
  SourceFeed_Type: {
    name: 'SourceFeed_Type',
    columns: [{
      id: 228167,
      name: 'ESG_Entity_IdentifierGUCI_ID',
      pk: false,
      fk: true,
      foreignKeyTable: 'ESG_Entity_Identifiers',
      foreignKeyColumn: 'GUCI_ID'
    }, {
      name: 'ESG_Entity_IdentifiersIdentifier_Type',
      pk: false,
      id: 228190,
      foreignKeyColumn: null,
      foreignKeyTable: null,
      fk: false,
    }]
  },
  ESG_Entity_Identifiers: {
    name: 'ESG_Entity_Identifiers',
    columns: [{
      id: 228208,
      name: 'GUCI_ID',
      pk: false,
      fk: true,
      foreignKeyTable: 'CCC',
      foreignKeyColumn: 'Column3'
    }, {
      name: 'ESG_Entity_IdentifiersIdentifier_Type',
      pk: false,
      id: 228190,
      foreignKeyColumn: null,
      foreignKeyTable: null,
      fk: false,
    }, {
      name: 'Identifier_Type',
      pk: false,
      id: 228125,
      foreignKeyColumn: null,
      foreignKeyTable: null,
      fk: false,
    }, {
      name: 'Column',
      pk: false,
      id: 228149,
      foreignKeyColumn: null,
      foreignKeyTable: null,
      fk: false,
    }]
  },
  CCC: {
    name: 'CCC',
    columns: [{
      id: 333333,
      name: 'Column3',
      pk: false,
      fk: false,
      foreignKeyTable: null,
      foreignKeyColumn: null
    }]
  }
};

export {
  tables
}