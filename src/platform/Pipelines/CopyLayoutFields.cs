using Sitecore.Events;
using System;
using Sitecore.Data.Items;
using System.Collections.Generic;
using System.Xml;
using Newtonsoft.Json;
using Sitecore.Data.Fields;
using System.Linq;
using Sitecore.Resources.Media;
using Sitecore;
using Sitecore.Data;

namespace XmCloudSXAStarter.Pipelines
{
    public class CopyLayoutFields
    {
        private const string PersonalizeCondition = "{8DCAA413-D590-4B02-B471-66E62ED57A0D}";

        private Item _currentItem;

        protected void OnItemSaved(object sender, EventArgs args)
        {
            var itemSaved = Event.ExtractParameter<Item>(args, 0);
            if (itemSaved == null)
                return;
            var finalField = itemSaved.Fields["PersonalizeDatasources"];
            if (finalField == null)
                return;

            _currentItem = itemSaved;

            using (new Sitecore.SecurityModel.SecurityDisabler())
            {
                itemSaved.Editing.BeginEdit();
                try
                {
                    var fieldValue = itemSaved.Fields["__Final Renderings"].Value;
                    itemSaved.Fields["PersonalizeDatasources"].Value = GoHorseSerialize(fieldValue);
                    itemSaved.Editing.EndEdit();
                }
                catch (Exception)
                {
                    itemSaved.Editing.CancelEdit();
                }
            }
        }

        public string GoHorseSerialize(string myField)
        {
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(myField);
            var nsManager = new XmlNamespaceManager(xmlDoc.NameTable);
            nsManager.AddNamespace("s", "s");

            var conditionNodes = xmlDoc.SelectNodes($"//condition[@s:id='{PersonalizeCondition}']", nsManager);

            var lstGoHorse = new List<GoHorsePersonalize>();
            foreach (XmlNode conditionNode in conditionNodes)
            {
                // Get attributes from the conditionNode
                var experienceId = conditionNode.Attributes["s:experienceId"].Value;
                var experienceValue = conditionNode.Attributes["s:experienceValue"].Value;
                var uniqueId = string.Empty;
                dynamic dataSource = null;

                // Get rendering (parent) to retrieve the UniqueId
                var renderingNode = GetRenderingAncestor(conditionNode);
                if (renderingNode != null)
                {
                    uniqueId = renderingNode.Attributes["uid"].Value;
                    if (!string.IsNullOrEmpty(uniqueId))
                        uniqueId = uniqueId.ToLower().Replace("{", "").Replace("}", "");
                }

                // Get sibling action to retrieve the DatasourceItem
                var actionNode = GetActionSibling(conditionNode.ParentNode);
                if (actionNode != null)
                {
                    var datasourceRaw = actionNode.Attributes["s:DataSource"].Value;
                    if (datasourceRaw.StartsWith("local:"))
                        datasourceRaw = datasourceRaw.Replace("local:", _currentItem.Paths.Path);

                    if (!string.IsNullOrEmpty(datasourceRaw))
                    {
                        var datasourceItem = _currentItem.Database.GetItem(datasourceRaw);
                        if (datasourceItem != null)
                            dataSource = SerializeItem(datasourceItem);
                    }
                }

                // Fill up the object and add to the list
                lstGoHorse.Add(new GoHorsePersonalize
                {
                    ExperienceId = experienceId,
                    ExperienceValue = experienceValue,
                    UniqueId = uniqueId,
                    DataSource = dataSource
                });
            }
            return JsonConvert.SerializeObject(lstGoHorse);
        }

        public dynamic SerializeItem(Item item)
        {
            var fields = new Dictionary<string, dynamic>();
            dynamic ret = new
            {
                id = item.ID.ToString(),
                path = item.Paths.Path,
                name = item.Name,
                displayName = item.DisplayName,
                version = item.Version.ToString(),
                language = item.Language.Name,
                fields
            };

            foreach (Field field in item.Fields.Cast<Field>())
            {
                if (fields.ContainsKey(field.Name) || field.Name.StartsWith("__"))
                    continue;

                var type = FieldTypeManager.GetField(field);

                if (type is ImageField)
                {
                    var imgData = GetImageField((ImageField)field);
                    fields.Add(field.Name, imgData);
                }
                else if (type is LinkField)
                {
                    var linkData = GetLinkField((LinkField)type);
                    fields.Add(field.Name, linkData);
                }
                else
                    fields.Add(field.Name, field.Value);
            }

            return ret;
        }

        public dynamic GetLinkField(LinkField linkField)
        {
            string url = string.Empty;

            switch (linkField.LinkType)
            {
                case "internal":
                case "external":
                case "mailto":
                case "anchor":
                case "javascript":
                    url = linkField.Url;
                    break;
                case "media":
                    MediaItem media = new MediaItem(linkField.TargetItem);
                    url = StringUtil.EnsurePrefix('/', MediaManager.GetMediaUrl(media));
                    break;
                default:
                    break;
            }

            return new
            {
                href = url,
                target = linkField.Target,
                text = linkField.Text,
                title = linkField.Title,
                @class = linkField.Class
            };
        }

        public dynamic GetImageField(ImageField imageField)
        {
            string src = "";
            string alt = "";
            if (imageField != null && imageField.MediaItem != null)
            {
                var imageItem = new MediaItem(imageField.MediaItem);
                src = StringUtil.EnsurePrefix('/', MediaManager.GetMediaUrl(imageItem));
                alt = imageItem.Alt;
            }
            return new
            {
                src,
                alt
            };
        }

        public XmlNode GetRenderingAncestor(XmlNode node)
        {
            while (node != null)
            {
                if (node.Name == "r")
                    return node;
                node = node.ParentNode;
            }
            return null;
        }

        public XmlNode GetActionSibling(XmlNode node)
        {
            XmlNode sibling = node.NextSibling;
            while (sibling != null)
            {
                if (sibling.Name == "actions")
                {
                    XmlNodeList actionNodes = sibling.SelectNodes("action");
                    if (actionNodes == null || actionNodes.Count == 0)
                        return null;
                    return actionNodes[0];
                }
                sibling = sibling.NextSibling;
            }

            sibling = node.PreviousSibling;
            while (sibling != null)
            {
                if (sibling.Name == "actions")
                {
                    XmlNodeList actionNodes = sibling.SelectNodes("action");
                    if (actionNodes == null || actionNodes.Count == 0)
                        return null;
                    return actionNodes[0];
                }
                sibling = sibling.PreviousSibling;
            }

            return null;
        }
    }

    [Serializable]
    internal class GoHorsePersonalize
    {
        public string UniqueId { get; set; }
        public string ExperienceId { get; set; }
        public string ExperienceValue { get; set; }
        public dynamic DataSource { get; set; }
    }
}