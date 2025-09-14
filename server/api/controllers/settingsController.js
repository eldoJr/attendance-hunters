const { success, error } = require('../utils/response');

// Mock settings storage (in real app, would use database)
let systemSettings = {
  general: {
    systemName: 'Attendance Management System',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    language: 'en'
  },
  attendance: {
    allowLateMarking: true,
    lateThresholdMinutes: 15,
    autoMarkAbsent: true,
    autoMarkAbsentMinutes: 30,
    requireLocation: false,
    allowBulkOperations: true
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    attendanceReminders: true,
    reportGeneration: true
  },
  security: {
    sessionTimeout: 24,
    passwordMinLength: 8,
    requireSpecialChars: true,
    maxLoginAttempts: 5,
    lockoutDuration: 30
  },
  reports: {
    defaultFormat: 'PDF',
    autoGenerate: false,
    retentionDays: 365,
    includeCharts: true
  },
  academic: {
    currentAcademicYear: '2024-2025',
    semesterSystem: true,
    attendanceThreshold: 75,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  }
};

const getSettings = async (req, res, next) => {
  try {
    const { category } = req.query;

    if (category && systemSettings[category]) {
      res.json(success({ [category]: systemSettings[category] }));
    } else {
      res.json(success(systemSettings));
    }
  } catch (err) {
    next(err);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;

    // Validate and update settings
    Object.keys(updates).forEach(category => {
      if (systemSettings[category]) {
        systemSettings[category] = {
          ...systemSettings[category],
          ...updates[category]
        };
      }
    });

    res.json(success(systemSettings, 'Settings updated successfully'));
  } catch (err) {
    next(err);
  }
};

const resetSettings = async (req, res, next) => {
  try {
    const { category } = req.body;

    if (category && systemSettings[category]) {
      // Reset specific category to defaults
      switch (category) {
        case 'general':
          systemSettings.general = {
            systemName: 'Attendance Management System',
            timezone: 'UTC',
            dateFormat: 'YYYY-MM-DD',
            timeFormat: '24h',
            language: 'en'
          };
          break;
        case 'attendance':
          systemSettings.attendance = {
            allowLateMarking: true,
            lateThresholdMinutes: 15,
            autoMarkAbsent: true,
            autoMarkAbsentMinutes: 30,
            requireLocation: false,
            allowBulkOperations: true
          };
          break;
        // Add other categories as needed
      }
      res.json(success(systemSettings[category], `${category} settings reset to defaults`));
    } else {
      // Reset all settings
      systemSettings = {
        general: {
          systemName: 'Attendance Management System',
          timezone: 'UTC',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: '24h',
          language: 'en'
        },
        attendance: {
          allowLateMarking: true,
          lateThresholdMinutes: 15,
          autoMarkAbsent: true,
          autoMarkAbsentMinutes: 30,
          requireLocation: false,
          allowBulkOperations: true
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          attendanceReminders: true,
          reportGeneration: true
        },
        security: {
          sessionTimeout: 24,
          passwordMinLength: 8,
          requireSpecialChars: true,
          maxLoginAttempts: 5,
          lockoutDuration: 30
        },
        reports: {
          defaultFormat: 'PDF',
          autoGenerate: false,
          retentionDays: 365,
          includeCharts: true
        },
        academic: {
          currentAcademicYear: '2024-2025',
          semesterSystem: true,
          attendanceThreshold: 75,
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      };
      res.json(success(systemSettings, 'All settings reset to defaults'));
    }
  } catch (err) {
    next(err);
  }
};

const exportSettings = async (req, res, next) => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="settings_backup_${timestamp}.json"`);
    res.json({
      exportDate: new Date().toISOString(),
      version: '1.0',
      settings: systemSettings
    });
  } catch (err) {
    next(err);
  }
};

const importSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json(error('Invalid settings format', 400));
    }

    // Validate and import settings
    Object.keys(settings).forEach(category => {
      if (systemSettings[category]) {
        systemSettings[category] = {
          ...systemSettings[category],
          ...settings[category]
        };
      }
    });

    res.json(success(systemSettings, 'Settings imported successfully'));
  } catch (err) {
    next(err);
  }
};

const getSystemInfo = async (req, res, next) => {
  try {
    const systemInfo = {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };

    res.json(success(systemInfo));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  resetSettings,
  exportSettings,
  importSettings,
  getSystemInfo
};