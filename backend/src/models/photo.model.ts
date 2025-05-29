import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.config';
import User from './user.model';

// Photo attributes interface
interface PhotoAttributes {
  id: number;
  sender_id: number;
  image_url: string;
  caption?: string;
  created_at: Date;
  deleted_at?: Date;
}

// Photo creation attributes interface
interface PhotoCreationAttributes extends Optional<PhotoAttributes, 'id' | 'created_at' | 'deleted_at'> {}

// Photo model class
class Photo extends Model<PhotoAttributes, PhotoCreationAttributes> implements PhotoAttributes {
  public id!: number;
  public sender_id!: number;
  public image_url!: string;
  public caption?: string;
  public created_at!: Date;
  public deleted_at?: Date;
}

// Initialize Photo model
Photo.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Photo',
    tableName: 'photos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    paranoid: true,
    deletedAt: 'deleted_at',
    indexes: [
      {
        fields: ['sender_id'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['deleted_at'],
      },
    ],
  }
);

// Define associations
Photo.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

export default Photo;
