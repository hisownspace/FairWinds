"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import fetch from "node-fetch";
// const axios = require("axois");
var axios_1 = require("axios");
var TripLocation = /** @class */ (function () {
    function TripLocation(address, latitude, longitude) {
        if (address === void 0) { address = ""; }
        if (latitude === void 0) { latitude = NaN; }
        if (longitude === void 0) { longitude = NaN; }
        this.observationStations = "";
        this.forecastHourly = "";
        this.zoneId = "";
        this.locationInfo = {
            city: "",
            state: "",
            timeZone: "",
        };
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.arrivalTime = this.getArrivalTime();
    }
    // Initializes object with values received from API response
    TripLocation.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var city, state, timeZone, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getRequestMetadata()];
                    case 1:
                        _c = _d.sent(), this.forecastHourly = _c[0], this.observationStations = _c[1], this.zoneId = _c[2], city = _c[3], state = _c[4], timeZone = _c[5];
                        this.locationInfo = { city: city, state: state, timeZone: timeZone };
                        _a = this;
                        return [4 /*yield*/, this.getForecast()];
                    case 2:
                        _a.forecast = _d.sent();
                        _b = this;
                        return [4 /*yield*/, this.getActiveAlerts()];
                    case 3:
                        _b.alerts = _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // determines arrival time for location
    TripLocation.prototype.getArrivalTime = function () {
        //! This is currently hardcoded to five hours in the future!!!!!
        var time = new Date();
        time.setHours(time.getHours() + 5);
        return time;
    };
    // gets initial information from weather api about location
    TripLocation.prototype.getRequestMetadata = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, forecastHourly, observationStations, city, state, timeZone, zoneParts, zoneId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://api.weather.gov/points/".concat(this.latitude, ",").concat(this.longitude))];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        forecastHourly = data.properties.forecastHourly;
                        observationStations = data.properties.observationStations;
                        city = data.properties.relativeLocation.properties.city;
                        state = data.properties.relativeLocation.properties.state;
                        timeZone = data.properties.timeZone;
                        zoneParts = data.properties.forecastZone.split("/");
                        zoneId = zoneParts[zoneParts.length - 1];
                        return [2 /*return*/, [forecastHourly, observationStations, zoneId, city, state, timeZone]];
                }
            });
        });
    };
    // retrieves and parses forecast information for location
    TripLocation.prototype.getForecast = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, expiry, data, forecast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.forecastHourly)];
                    case 1:
                        res = _a.sent();
                        expiry = new Date(res.headers.expires);
                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        console.log("getForecast request made at", new Date().toString());
                        console.log("next expiry:               ", expiry.toString());
                        data = res.data;
                        forecast = this.getRelevantForecastData(data.properties.periods);
                        this.scheduleNextRequest(this.getForecast.bind(this), expiry);
                        return [2 /*return*/, forecast];
                }
            });
        });
    };
    TripLocation.prototype.getRelevantForecastData = function (periods) {
        var forecast = {};
        for (var _i = 0, periods_1 = periods; _i < periods_1.length; _i++) {
            var period = periods_1[_i];
            var startTime = new Date(period.startTime);
            var endTime = new Date(period.endTime);
            if ((endTime.getTime() > this.arrivalTime.getTime() &&
                startTime.getTime() < this.arrivalTime.getTime()) ||
                (endTime.getTime() > this.arrivalTime.getTime() + 900000 &&
                    startTime.getTime() < this.arrivalTime.getTime() - 900000) ||
                (endTime.getTime() > this.arrivalTime.getTime() + 900000 &&
                    startTime.getTime() < this.arrivalTime.getTime() - 900000)) {
                forecast = period;
            }
        }
        console.log("Forecast:", forecast);
        return [forecast];
    };
    // checks for active warnings, watches, advisories, etc...
    TripLocation.prototype.getActiveAlerts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, expiry, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://api.weather.gov/alerts/active/zone/".concat(this.zoneId))];
                    case 1:
                        res = _a.sent();
                        headers = res.headers;
                        expiry = new Date(headers.expires);
                        console.log("expiry:", expiry);
                        console.log("getActiveAlerts request made at", new Date().toString());
                        console.log("next expiry:                   ", expiry.toString());
                        data = res.data;
                        this.scheduleNextRequest(this.getActiveAlerts.bind(this), expiry);
                        return [2 /*return*/, data.features];
                }
            });
        });
    };
    TripLocation.prototype.scheduleNextRequest = function (requestMethod, expiry) {
        var now = new Date();
        if (this.arrivalTime.getTime() - now.getTime() < 3600000) {
            setTimeout(requestMethod, 4 * (expiry.getTime() - now.getTime()));
        }
        else if (this.arrivalTime.getTime() - now.getTime() < 18000000) {
            setTimeout(requestMethod, 20 * (expiry.getTime() - now.getTime()));
        }
        else {
            setTimeout(requestMethod, 3600000);
        }
    };
    return TripLocation;
}());
var ImportantLocation = /** @class */ (function (_super) {
    __extends(ImportantLocation, _super);
    function ImportantLocation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.closestStation = "";
        return _this;
    }
    ImportantLocation.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var city, state, timeZone, _, _a, _b, _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.getRequestMetadata()];
                    case 1:
                        _d = _e.sent(), _ = _d[0], this.observationStations = _d[1], this.zoneId = _d[2], city = _d[3], state = _d[4], timeZone = _d[5];
                        this.locationInfo = { city: city, state: state, timeZone: timeZone };
                        _a = this;
                        return [4 /*yield*/, this.getClosestObservationStation()];
                    case 2:
                        _a.closestStation = _e.sent();
                        _b = this;
                        return [4 /*yield*/, this.getCurrentConditions()];
                    case 3:
                        _b.currentConditions = _e.sent();
                        console.log("Current Conditions:", this.currentConditions);
                        _c = this;
                        return [4 /*yield*/, this.getActiveAlerts()];
                    case 4:
                        _c.alerts = _e.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // overrides arrivalTime function, setting current time to now
    ImportantLocation.prototype.getArrivalTime = function () {
        return new Date();
    };
    // requests for current conditions for appropriate observation station
    ImportantLocation.prototype.getCurrentConditions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, currentConditions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.closestStation)];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        currentConditions = data.features[0];
                        return [2 /*return*/, currentConditions];
                }
            });
        });
    };
    // determines best observation station to represent current conditions
    ImportantLocation.prototype.getClosestObservationStation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, headers, features, closestStation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.observationStations)];
                    case 1:
                        res = _a.sent();
                        data = res.data;
                        headers = res.headers;
                        features = data.features;
                        closestStation = features[0].id;
                        return [2 /*return*/, "".concat(closestStation, "/observations")];
                }
            });
        });
    };
    ImportantLocation.prototype.scheduleNextRequest = function (requestMethod, expiry) {
        var now = new Date();
        setTimeout(requestMethod, expiry.getTime() - now.getTime());
    };
    return ImportantLocation;
}(TripLocation));
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var startLocation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                startLocation = new ImportantLocation("", 38.8894, -77.0352);
                return [4 /*yield*/, startLocation.init()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
main();
