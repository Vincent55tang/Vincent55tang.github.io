module.exports = function (s) {
    return s.toLowerCase().split('_').join(' ').replace(/\b\w/g, function(l) { return l.toUpperCase() });
}
