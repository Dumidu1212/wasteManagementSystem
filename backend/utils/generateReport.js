import WasteCollection from '../models/WasteCollection.js';

/**
 * Generates report data based on the report type and criteria.
 * @param {String} reportType - Type of the report (monthly, annual, custom)
 * @param {String} criteria - Criteria for generating the report (e.g., specific month, year)
 * @returns {Array} - Formatted report data
 */
const generateReportData = async (reportType, criteria) => {
  let startDate, endDate;

  switch (reportType) {
    case 'monthly':
      const [year, month] = criteria.split('-'); // Expected format: YYYY-MM
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
      break;
    case 'annual':
      startDate = new Date(criteria, 0, 1); // Start of the year
      endDate = new Date(criteria, 11, 31); // End of the year
      break;
    case 'custom':
      const [start, end] = criteria.split(',');
      startDate = new Date(start.trim());
      endDate = new Date(end.trim());
      break;
    default:
      throw new Error('Invalid report type');
  }

  // Aggregate waste data
  const wasteData = await WasteCollection.aggregate([
    {
      $match: {
        collectionDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: '$wasteType',
        totalQuantity: { $sum: '$quantity' },
        totalCollections: { $sum: 1 },
      },
    },
  ]);

  // Format the data
  return wasteData.map((item) => ({
    wasteType: item._id,
    totalQuantity: item.totalQuantity,
    totalCollections: item.totalCollections,
  }));
};

export default generateReportData;
