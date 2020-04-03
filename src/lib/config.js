const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const Profile = require('./model/profile');

module.exports = new class Config {
    constructor() {
        this.load();
    }

    load() {
        const configPath = path.normalize(process.cwd() + '/config/');
        this.filePath = configPath + 'profiles.yml';

        if (!fs.existsSync(configPath)) {
            fs.mkdirSync(configPath);
        }

        try {
            const fileContents = fs.readFileSync(this.filePath, 'utf-8');
            this.data = yaml.parse(fileContents);
        } catch (e) {
            this.data = {
                profiles: {}
            };
            this.save();
        }
    }

    save() {
        fs.writeFileSync(this.filePath, yaml.stringify(this.data), 'utf-8');
    }

    getProfiles() {
        return Object.keys(this.data.profiles).map(key => new Profile(this.data.profiles[key]));
    }
}
