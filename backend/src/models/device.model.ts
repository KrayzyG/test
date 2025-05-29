import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.config';
import User from './user.model';

// Device attributes interface
interface DeviceAttributes {
  id: number;
  user_id: number;
  device_token: string;
  platform: 'ios' | 'android';
  created_at: Date;
  last_active_at: Date;
}

// Device creation attributes interface
interface DeviceCreationAttributes extends Optional<DeviceAttributes, 'id' | 'created_at' | 'last_active_at'> {}

// Device model class
class Device extends Model<DeviceAttributes, DeviceCreationAttributes> implements DeviceAttributes {
  public id!: number;
  public user_id!: number;
  public device_token!: string;
  public platform!: 'ios' | 'android';
  public created_at!: Date;
  public last_active_at!: Date;
}

// Initialize Device model
Device.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    device_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    platform: {
      type: DataTypes.ENUM('ios', 'android'),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    last_active_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Device',
    tableName: 'devices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['platform'],
      },
      {
        fields: ['last_active_at'],
      },
    ],
  }
);

// Define associations
Device.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Device, { foreignKey: 'user_id', as: 'devices' });

export default Device;
