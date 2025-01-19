import 'dotenv/config';
import {Configuration, ConfigurationKeys,} from './model/configuration';
import {Service} from 'typedi';
import _ from 'lodash';
import {Logger} from './logger';

@Service()
export class EnvironmentVariablesParser {
    private readonly configuration: Configuration;

    private readonly requiredConfigurationKeys = [
        ConfigurationKeys.NTFY_URL,
        ConfigurationKeys.NTFY_TOPIC,
        ConfigurationKeys.PLEX_TOKEN,
        ConfigurationKeys.PLEX_URL,
    ];

    constructor(private readonly logger: Logger) {
        this.configuration = this.buildConfiguration();
    }

    public getConfigration(): Configuration {
        return this.configuration;
    }

    private buildConfiguration(): Configuration {
        const partialConfiguration = this.parseEnvironmentVariables();
        const requiredKeys = _.keys(this.requiredConfigurationKeys);

        if (!this.checkRequiredKeys(partialConfiguration)) {
            const missingRequiredKeys = _.entries(partialConfiguration)
                .filter(([key, value]) => _.isUndefined(value) && requiredKeys.includes(key))
                .map(([key]) => key);
            const errorMessage = `Missing Configuration: Please check configuration for following missing configuration keys: ${missingRequiredKeys.join(
                ','
            )}`;
            this.logger.error(
                errorMessage
            );
            throw new Error(errorMessage);
        }
        return partialConfiguration;
    }

    private parseEnvironmentVariables(): Partial<Configuration> {
        const envValues = process.env;
        return _.values(ConfigurationKeys).reduce(
            (previousValue, currentValue) => {
                return {...previousValue, [currentValue]: envValues[currentValue]};
            },
            {}
        );
    }

    private checkRequiredKeys(tmpConfig: Partial<Configuration>): tmpConfig is Configuration {
        const requiredKeys = _.keys(this.requiredConfigurationKeys);
        return _.entries(tmpConfig).filter(([key,]) => requiredKeys.includes(key)).every(([, value]) => _.isUndefined(value))
    }
}
