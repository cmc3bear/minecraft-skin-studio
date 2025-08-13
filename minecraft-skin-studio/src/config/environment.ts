/**
 * Environment Configuration and Validation
 * Ensures all required environment variables are present
 * and validates their format before application startup
 */

interface EnvironmentConfig {
  OPENAI_API_KEY: string;
  API_URL: string;
  COPPA_VERIFICATION_KEY?: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private config: Partial<EnvironmentConfig> = {};
  private validated = false;

  private constructor() {}

  static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  /**
   * Validates that all required environment variables are present
   * @throws {Error} If any required variables are missing
   */
  validate(): void {
    if (this.validated) return;

    const required = [
      'VITE_OPENAI_API_KEY',
      'VITE_API_URL'
    ];

    const missing: string[] = [];
    
    required.forEach(key => {
      const value = import.meta.env[key];
      if (!value || value === '') {
        missing.push(key);
      }
    });

    if (missing.length > 0) {
      const errorMessage = `Missing required environment variables: ${missing.join(', ')}. Please check your .env file.`;
      console.error(errorMessage);
      
      // In development, provide helpful instructions
      if (import.meta.env.DEV) {
        console.error(`
To fix this issue:
1. Create a .env file in the minecraft-skin-studio directory
2. Add the following variables:
   ${missing.map(key => `${key}=your_value_here`).join('\n   ')}
3. Restart the development server
        `);
      }
      
      throw new Error(errorMessage);
    }

    // Validate API key format (basic check)
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey && !apiKey.startsWith('sk-')) {
      console.warn('Warning: OpenAI API key should start with "sk-". Please verify your API key.');
    }

    // Validate API URL format
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      try {
        new URL(apiUrl);
      } catch (error) {
        throw new Error(`Invalid API URL format: ${apiUrl}. Please provide a valid URL.`);
      }
    }

    this.validated = true;
    this.storeConfig();
  }

  /**
   * Stores validated configuration for runtime access
   */
  private storeConfig(): void {
    this.config = {
      OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
      API_URL: import.meta.env.VITE_API_URL,
      COPPA_VERIFICATION_KEY: import.meta.env.VITE_COPPA_VERIFICATION_KEY,
      NODE_ENV: import.meta.env.MODE as EnvironmentConfig['NODE_ENV']
    };
  }

  /**
   * Gets a validated environment variable
   * @param key The environment variable key
   * @returns The environment variable value
   */
  get<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] | undefined {
    if (!this.validated) {
      this.validate();
    }
    return this.config[key] as EnvironmentConfig[K] | undefined;
  }

  /**
   * Checks if the application is running in production
   */
  isProduction(): boolean {
    return import.meta.env.PROD;
  }

  /**
   * Checks if the application is running in development
   */
  isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  /**
   * Gets the current environment mode
   */
  getMode(): string {
    return import.meta.env.MODE;
  }

  /**
   * Safely logs environment information (without sensitive data)
   */
  logEnvironmentInfo(): void {
    console.log('Environment Information:');
    console.log(`- Mode: ${this.getMode()}`);
    console.log(`- API URL: ${this.config.API_URL || 'Not configured'}`);
    console.log(`- OpenAI API: ${this.config.OPENAI_API_KEY ? 'Configured' : 'Not configured'}`);
    console.log(`- COPPA Verification: ${this.config.COPPA_VERIFICATION_KEY ? 'Configured' : 'Not configured'}`);
  }
}

// Export singleton instance
export const envConfig = EnvironmentValidator.getInstance();

// Export validation function for use in main.tsx
export const validateEnvironment = (): void => {
  envConfig.validate();
};

// Export helper functions
export const getApiKey = (): string => {
  const key = envConfig.get('OPENAI_API_KEY');
  if (!key) {
    throw new Error('OpenAI API key not configured');
  }
  return key;
};

export const getApiUrl = (): string => {
  const url = envConfig.get('API_URL');
  if (!url) {
    throw new Error('API URL not configured');
  }
  return url;
};

export const getCoppaVerificationKey = (): string | undefined => {
  return envConfig.get('COPPA_VERIFICATION_KEY');
};

export const isProduction = (): boolean => envConfig.isProduction();
export const isDevelopment = (): boolean => envConfig.isDevelopment();