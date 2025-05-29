import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.config';
import User from './user.model';

// Notification attributes interface
interface NotificationAttributes {
  id: number;
  user_id: number;
  type: 'photo' | 'friend_request' | 'friend_accept' | 'system';
  reference_id?: number;
  content: string;
  is_read: boolean;
  created_at: Date;
}

// Notification creation attributes interface
interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'created_at' | 'is_read'> {}

// Notification model class
class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public user_id!: number;
  public type!: 'photo' | 'friend_request' | 'friend_accept' | 'system';
  public reference_id?: number;
  public content!: string;
  public is_read!: boolean;
  public created_at!: Date;
}

// Initialize Notification model
Notification.init(
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
    type: {
      type: DataTypes.ENUM('photo', 'friend_request', 'friend_accept', 'system'),
      allowNull: false,
    },
    reference_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['is_read'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

// Define associations
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

export default Notification;
