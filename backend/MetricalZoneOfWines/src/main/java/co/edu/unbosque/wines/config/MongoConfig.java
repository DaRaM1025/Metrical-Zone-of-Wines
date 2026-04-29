package co.edu.unbosque.wines.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        return "wines_db";
    }

    @Override
    public MongoClient mongoClient() {
        // Aquí pegamos la URI directamente.
        // El # se pone como %23 para que el driver no se confunda.
        ConnectionString connectionString = new ConnectionString(
                "mongodb://wines_user:Password123%23@54.156.124.164:27017/wines_db?authSource=admin"
        );

        MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .build();

        return MongoClients.create(mongoClientSettings);
    }
}