export const documentSummaries = {
  equipmentManuals: {
    primaryCrushers: {
      "2254830": {
        ownerManual: {
          title: "Model 2254830 Owner's Manual",
          fileName: "2254830_Owner_s Manual.pdf",
          size: "2.5MB",
          summary: "Comprehensive owner's manual for Model 2254830 primary crushing equipment. Contains operation procedures, safety guidelines, maintenance schedules, and troubleshooting information.",
          keyTopics: [
            "Equipment overview and specifications",
            "Safety procedures and warnings",
            "Operating instructions",
            "Maintenance schedules",
            "Troubleshooting guide"
          ]
        },
        partsManual: {
          title: "Model 2254830 Parts Manual",
          fileName: "2254830_Parts Manual.pdf",
          size: "1.0MB",
          summary: "Complete parts catalog for Model 2254830 including part numbers, descriptions, and replacement procedures.",
          keyTopics: [
            "Parts identification and numbering",
            "Replacement procedures",
            "Spare parts recommendations",
            "Component specifications"
          ]
        }
      },
      "2254831": {
        ownerManual: {
          title: "Model 2254831 Owner's Manual",
          fileName: "2254831_Owner_s Manual.pdf",
          size: "6.6MB",
          summary: "Detailed owner's manual for Model 2254831 primary crushing equipment. Larger file size indicates comprehensive documentation with detailed procedures and specifications.",
          keyTopics: [
            "Equipment overview and specifications",
            "Safety procedures and warnings",
            "Operating instructions",
            "Maintenance schedules",
            "Troubleshooting guide",
            "Performance optimization"
          ]
        },
        partsManual: {
          title: "Model 2254831 Parts Manual",
          fileName: "2254831_Parts Manual.pdf",
          size: "1.5MB",
          summary: "Complete parts catalog for Model 2254831 including part numbers, descriptions, and replacement procedures.",
          keyTopics: [
            "Parts identification and numbering",
            "Replacement procedures",
            "Spare parts recommendations",
            "Component specifications"
          ]
        }
      },
      "P-250": {
        generalArrangement: {
          title: "P-250 General Arrangement Drawing",
          fileName: "23002-01-00 Arreglo Gral Mod P-250.pdf",
          size: "2.1MB",
          summary: "General arrangement drawing for Model P-250 crusher system showing overall layout, dimensions, and component positioning.",
          keyTopics: [
            "Overall system layout",
            "Component positioning",
            "Dimensions and clearances",
            "Installation requirements"
          ]
        },
        structuralAssembly: {
          title: "P-250 Structural Assembly",
          fileName: "23002-01-00B Ens Estructural P-250.pdf",
          size: "1.3MB",
          summary: "Structural assembly drawing for P-250 showing framework, supports, and structural components.",
          keyTopics: [
            "Structural framework design",
            "Support requirements",
            "Foundation specifications",
            "Structural connections"
          ]
        },
        walkwayArrangement: {
          title: "P-250 Walkway Arrangement",
          fileName: "23002-01-00C Arreglo Pasillos P-250.pdf",
          size: "873KB",
          summary: "Walkway and access arrangement drawing for P-250 showing maintenance access points and safety features.",
          keyTopics: [
            "Access walkways",
            "Safety railings",
            "Maintenance platforms",
            "Emergency egress routes"
          ]
        }
      }
    },
    materialHandling: {
      grizzlyFeeders: {
        tfSeries: {
          title: "TF Series Grizzly Feeder Manual",
          fileName: "TF SERIES Grizzly Feeder.pdf",
          size: "10.3MB",
          pages: 22,
          summary: "Comprehensive manual for TF Series Grizzly Feeder covering installation, operation, maintenance, and parts information.",
          keyTopics: [
            "Feeder specifications and capabilities",
            "Installation procedures",
            "Operating instructions",
            "Maintenance requirements",
            "Parts catalog",
            "Troubleshooting guide"
          ]
        },
        tf4016387: {
          title: "TF4016-387 Parts Manual",
          fileName: "DOC-17-002936-0 - Parts Manual TF4016-387.pdf",
          size: "776KB",
          summary: "Parts manual for TF4016-387 model including feeder drive, components, specifications, and replacement procedures.",
          keyTopics: [
            "Feeder drive components",
            "Component specifications",
            "Installation procedures",
            "Operation guidelines",
            "Maintenance procedures",
            "Parts replacement"
          ]
        }
      },
      beltConveyors: {
        bt48x9: {
          title: "Belt Conveyor BT-48x9 Operation & Maintenance Manual",
          fileName: "MANUAL OP Y MTTO BT -48 x 9 MTS.PDF",
          size: "3.5MB",
          language: "Spanish",
          summary: "Operation and maintenance manual for 48 x 9 meter belt conveyor system. Includes operational procedures, maintenance schedules, and safety guidelines.",
          keyTopics: [
            "Belt conveyor specifications",
            "Operating procedures",
            "Maintenance schedules",
            "Safety protocols",
            "Troubleshooting",
            "Performance optimization"
          ]
        }
      }
    }
  },
  operationMaintenance: {
    spanish: {
      primaryCrushing: {
        title: "Primary Crushing Unit on Skid - Operation & Maintenance Manual",
        fileName: "MANUAL DE MANT Y OP UNIDAD DE TRITURACIÓN PRIMARIA EN SKID.PDF",
        size: "2.2MB",
        pages: 51,
        language: "Spanish",
        summary: "Comprehensive operation and maintenance manual for primary crushing unit mounted on skid. Covers all aspects of operation, maintenance, and troubleshooting.",
        keyTopics: [
          "Skid-mounted crushing unit overview",
          "Operating procedures",
          "Maintenance schedules",
          "Safety protocols",
          "Troubleshooting procedures",
          "Performance monitoring"
        ]
      }
    }
  },
  technicalDrawings: {
    installationPlans: {
      skid616: {
        title: "Skid 616 General Installation Arrangement",
        fileName: "23002-5-1 Arreglo General de Instalacion Skid 616.pdf",
        size: "1.7MB",
        summary: "General installation arrangement drawing for Skid 616 showing equipment layout, connections, and installation requirements.",
        keyTopics: [
          "Equipment layout on skid",
          "Connection details",
          "Installation requirements",
          "Utility connections",
          "Access provisions"
        ]
      }
    }
  },
  installationDocumentation: {
    overview: {
      title: "Installation Manuals and Plans Overview",
      fileName: "T23002-03 Manuales y planos de instalación.pdf",
      size: "741KB",
      summary: "Overview document containing installation manuals and plans for the mining equipment systems.",
      keyTopics: [
        "Installation planning",
        "Documentation overview",
        "System integration",
        "Installation procedures"
      ]
    }
  }
};

export const menuStructure = [
  {
    id: 'equipment-manuals',
    title: 'Equipment Manuals',
    icon: '📖',
    children: [
      {
        id: 'primary-crushers',
        title: 'Primary Crushers',
        icon: '🔨',
        children: [
          {
            id: 'model-2254830',
            title: 'Model 2254830',
            children: [
              { id: '2254830-owner', title: "Owner's Manual", type: 'document' },
              { id: '2254830-parts', title: 'Parts Manual', type: 'document' }
            ]
          },
          {
            id: 'model-2254831',
            title: 'Model 2254831',
            children: [
              { id: '2254831-owner', title: "Owner's Manual", type: 'document' },
              { id: '2254831-parts', title: 'Parts Manual', type: 'document' }
            ]
          },
          {
            id: 'model-p250',
            title: 'Model P-250',
            children: [
              { id: 'p250-general', title: 'General Arrangement', type: 'document' },
              { id: 'p250-structural', title: 'Structural Assembly', type: 'document' },
              { id: 'p250-walkway', title: 'Walkway Arrangement', type: 'document' }
            ]
          }
        ]
      },
      {
        id: 'material-handling',
        title: 'Material Handling',
        icon: '🏗️',
        children: [
          {
            id: 'grizzly-feeders',
            title: 'Grizzly Feeders',
            children: [
              { id: 'tf-series', title: 'TF Series Manual', type: 'document' },
              { id: 'tf4016387', title: 'TF4016-387 Parts Manual', type: 'document' }
            ]
          },
          {
            id: 'belt-conveyors',
            title: 'Belt Conveyors',
            children: [
              { id: 'bt48x9', title: 'BT-48x9 Manual (Spanish)', type: 'document' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'technical-drawings',
    title: 'Technical Drawings',
    icon: '📐',
    children: [
      {
        id: 'installation-plans',
        title: 'Installation Plans',
        children: [
          { id: 'skid616', title: 'Skid 616 Installation', type: 'document' }
        ]
      }
    ]
  },
  {
    id: 'operation-maintenance',
    title: 'Operation & Maintenance',
    icon: '🔧',
    children: [
      {
        id: 'spanish-manuals',
        title: 'Spanish Manuals',
        children: [
          { id: 'primary-crushing-spanish', title: 'Primary Crushing Unit', type: 'document' }
        ]
      }
    ]
  },
  {
    id: 'installation-docs',
    title: 'Installation Documentation',
    icon: '📋',
    children: [
      { id: 'installation-overview', title: 'Installation Overview', type: 'document' }
    ]
  }
];