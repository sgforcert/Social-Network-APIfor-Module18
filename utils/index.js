// helper function to reformat date data
function formatDate (date) {
    return date.toLocaleString(
      'en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
      }
    ); 
  };

  module.exports = { formatDate };